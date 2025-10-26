"""Shared State feature."""

from __future__ import annotations

from dotenv import load_dotenv
load_dotenv()
import json
from enum import Enum
from typing import Dict, List, Any, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# ADK imports
from google.adk.agents import LlmAgent
from google.adk.agents.callback_context import CallbackContext
from google.adk.sessions import InMemorySessionService, Session
from google.adk.runners import Runner
from google.adk.events import Event, EventActions
from google.adk.tools import FunctionTool, ToolContext
from google.genai.types import Content, Part , FunctionDeclaration
from google.adk.models import LlmResponse, LlmRequest
from google.genai import types


class ProverbsState(BaseModel):
    """List of the proverbs being written."""
    proverbs: list[str] = Field(
        default_factory=list,
        description='The list of already written proverbs',
    )


def set_proverbs(
  tool_context: ToolContext,
  new_proverbs: list[str]
) -> Dict[str, str]:
    """
    Set the list of provers using the provided new list.

    Args:
        "new_proverbs": {
            "type": "array",
            "items": {"type": "string"},
            "description": "The new list of proverbs to maintain",
        }

    Returns:
        Dict indicating success status and message
    """
    try:
        # Put this into a state object just to confirm the shape
        new_state = { "proverbs": new_proverbs}
        tool_context.state["proverbs"] = new_state["proverbs"]
        return {"status": "success", "message": "Proverbs updated successfully"}

    except Exception as e:
        return {"status": "error", "message": f"Error updating proverbs: {str(e)}"}



def get_weather(tool_context: ToolContext, location: str) -> Dict[str, str]:
    """Get the weather for a given location. Ensure location is fully spelled out."""
    return {"status": "success", "message": f"The weather in {location} is sunny."}



def on_before_agent(callback_context: CallbackContext):
    """
    Initialize proverbs state if it doesn't exist.
    """

    if "proverbs" not in callback_context.state:
        # Initialize with default recipe
        default_proverbs =     []
        callback_context.state["proverbs"] = default_proverbs


    return None




# --- Define the Callback Function ---
#  modifying the agent's system prompt to incude the current state of the proverbs list
def before_model_modifier(
    callback_context: CallbackContext, llm_request: LlmRequest
) -> Optional[LlmResponse]:
    """Inspects/modifies the LLM request or skips the call."""
    agent_name = callback_context.agent_name
    if agent_name == "ProverbsAgent":
        proverbs_json = "No proverbs yet"
        if "proverbs" in callback_context.state and callback_context.state["proverbs"] is not None:
            try:
                proverbs_json = json.dumps(callback_context.state["proverbs"], indent=2)
            except Exception as e:
                proverbs_json = f"Error serializing proverbs: {str(e)}"
        # --- Modification Example ---
        # Add a prefix to the system instruction
        original_instruction = llm_request.config.system_instruction or types.Content(role="system", parts=[])
        prefix = f"""You are a helpful assistant for maintaining a list of proverbs.
        This is the current state of the list of proverbs: {proverbs_json}
        When you modify the list of proverbs (wether to add, remove, or modify one or more proverbs), use the set_proverbs tool to update the list."""
        # Ensure system_instruction is Content and parts list exists
        if not isinstance(original_instruction, types.Content):
            # Handle case where it might be a string (though config expects Content)
            original_instruction = types.Content(role="system", parts=[types.Part(text=str(original_instruction))])
        if not original_instruction.parts:
            original_instruction.parts.append(types.Part(text="")) # Add an empty part if none exist

        # Modify the text of the first part
        modified_text = prefix + (original_instruction.parts[0].text or "")
        original_instruction.parts[0].text = modified_text
        llm_request.config.system_instruction = original_instruction



    return None






# --- Define the Callback Function ---
def simple_after_model_modifier(
    callback_context: CallbackContext, llm_response: LlmResponse
) -> Optional[LlmResponse]:
    """Stop the consecutive tool calling of the agent"""
    agent_name = callback_context.agent_name
    # --- Inspection ---
    if agent_name == "ProverbsAgent":
        original_text = ""
        if llm_response.content and llm_response.content.parts:
            # Assuming simple text response for this example
            if  llm_response.content.role=='model' and llm_response.content.parts[0].text:
                original_text = llm_response.content.parts[0].text
                callback_context._invocation_context.end_invocation = True

        elif llm_response.error_message:
            return None
        else:
            return None # Nothing to modify
    return None


proverbs_agent = LlmAgent(
        name="ProverbsAgent",
        model="gemini-2.5-flash",
        instruction=f"""
        When a user asks you to do anything regarding proverbs, you MUST use the set_proverbs tool.

        IMPORTANT RULES ABOUT PROVERBS AND THE SET_PROVERBS TOOL:
        1. Always use the set_proverbs tool for any proverbs-related requests
        2. Always pass the COMPLETE LIST of proverbs to the set_proverbs tool. If the list had 5 proverbs and you removed one, you must pass the complete list of 4 remaining proverbs.
        3. You can use existing proverbs if one is relevant to the user's request, but you can also create new proverbs as required.
        4. Be creative and helpful in generating complete, practical proverbs
        5. After using the tool, provide a brief summary of what you create, removed, or changed        7.

        Examples of when to use the set_proverbs tool:
        - "Add a proverb about soap" → Use tool with an array containing the existing list of proverbs with the new proverb about soap at the end.
        - "Remove the first proverb" → Use tool with an array containing the all of the existing proverbs except the first one"
        - "Change any proverbs about cats to mention that they have 18 lives" → If no proverbs mention cats, do not use the tool. If one or more proverbs do mention cats, change them to mention cats having 18 lives, and use the tool with an array of all of the proverbs, including ones that were changed and ones that did not require changes.

        Do your best to ensure proverbs plausibly make sense.


        IMPORTANT RULES ABOUT WEATHER AND THE GET_WEATHER TOOL:
        1. Only call the get_weather tool if the user asks you for the weather in a given location.
        2. If the user does not specify a location, you can use the location "Everywhere ever in the whole wide world"

        Examples of when to use the get_weather tool:
        - "What's the weather today in Tokyo?" → Use the tool with the location "Tokyo"
        - "Whats the weather right now" → Use the location "Everywhere ever in the whole wide world"
        - Is it raining in London? → Use the tool with the location "London"
        """,
        tools=[set_proverbs, get_weather],
        before_agent_callback=on_before_agent,
        before_model_callback=before_model_modifier,
        after_model_callback = simple_after_model_modifier
    )

# Initialize session service and runner
session_service = InMemorySessionService()
runner = Runner(app_name="proverbs_app", agent=proverbs_agent, session_service=session_service)

# Request/Response models
class ChatMessage(BaseModel):
    message: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    session_id: str

class AgentRequest(BaseModel):
    """Request model for ADK agent endpoint."""
    session_id: str = "default_session"
    messages: List[Dict[str, Any]] = []
    state: Optional[Dict[str, Any]] = None

class AgentResponse(BaseModel):
    """Response model for ADK agent endpoint."""
    messages: List[Dict[str, Any]] = []
    state: Optional[Dict[str, Any]] = None

# Create FastAPI app
app = FastAPI(title="ADK Proverbs Agent")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "ADK Proverbs Agent API",
        "endpoints": {
            "POST /": "Main agent endpoint (for @ag-ui/client)",
            "POST /chat": "Send a message to the agent",
            "GET /health": "Health check"
        }
    }

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.post("/")
async def agent_endpoint(request: AgentRequest):
    """Main endpoint for @ag-ui/client integration."""
    try:
        session_id = request.session_id or "default_session"
        
        # Get the last user message
        user_message = ""
        if request.messages and len(request.messages) > 0:
            last_message = request.messages[-1]
            if isinstance(last_message, dict) and "content" in last_message:
                user_message = last_message["content"]
        
        if not user_message:
            return AgentResponse(
                messages=[],
                state=request.state or {}
            )
        
        # Create event
        event = Event(
            author="user",
            actions=[EventActions.content(user_message)]
        )
        
        # Run the agent
        response_events = []
        async for response_event in runner.run_async(
            session_id=session_id,
            event=event
        ):
            response_events.append(response_event)
        
        # Extract the response text
        response_text = ""
        for resp_event in response_events:
            if resp_event.actions:
                for action in resp_event.actions:
                    if hasattr(action, 'content') and action.content:
                        if hasattr(action.content, 'parts'):
                            for part in action.content.parts:
                                if hasattr(part, 'text') and part.text:
                                    response_text += part.text
        
        if not response_text:
            response_text = "I received your message but couldn't generate a response."
        
        # Get the current state from the session
        session = session_service.get_session(session_id)
        current_state = session.state if session else {}
        
        # Format response
        response_messages = [
            {
                "role": "assistant",
                "content": response_text
            }
        ]
        
        return AgentResponse(
            messages=response_messages,
            state=current_state
        )
    
    except Exception as e:
        print(f"Error in agent endpoint: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error processing message: {str(e)}")

@app.post("/chat", response_model=ChatResponse)
async def chat(chat_message: ChatMessage):
    """Send a message to the agent and get a response."""
    try:
        # Get or create session
        session_id = chat_message.session_id or "default_session"
        
        # Send message to agent
        event = Event(
            author="user",
            actions=[EventActions.content(chat_message.message)]
        )
        
        # Run the agent
        response_events = []
        async for response_event in runner.run_async(
            session_id=session_id,
            event=event
        ):
            response_events.append(response_event)
        
        # Extract the response text
        response_text = ""
        for resp_event in response_events:
            if resp_event.actions:
                for action in resp_event.actions:
                    if hasattr(action, 'content') and action.content:
                        if hasattr(action.content, 'parts'):
                            for part in action.content.parts:
                                if hasattr(part, 'text') and part.text:
                                    response_text += part.text
        
        if not response_text:
            response_text = "I received your message but couldn't generate a response."
        
        return ChatResponse(
            response=response_text,
            session_id=session_id
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing message: {str(e)}")

if __name__ == "__main__":
    import os
    import uvicorn

    if not os.getenv("GOOGLE_API_KEY"):
        print("⚠️  Warning: GOOGLE_API_KEY environment variable not set!")
        print("   Set it with: export GOOGLE_API_KEY='your-key-here'")
        print("   Get a key from: https://makersuite.google.com/app/apikey")
        print()

    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
