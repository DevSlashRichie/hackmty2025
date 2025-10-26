# Copyright 2025 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

from google.adk.agents import Agent
from google.adk.tools import google_search, agent_tool

MODEL_GEMINI_2_0_FLASH = "gemini-2.0-flash"

Agent_Search = Agent(
    model='gemini-2.0-flash-exp',
    name='SearchAgent',
    instruction="""
    You're a specialist in Google Search
    """,
    tools=[google_search]
)

offer_agent = Agent(
    name="offer_agent",
    model=MODEL_GEMINI_2_0_FLASH,
    description="Agent to make a micro-credit offer or thank the user.",
    instruction='''
        You are a financial assistant.
        You will be given the result of an energy consumption analysis in the `offer_decision` variable.

        If `offer_decision` is "APPROVE", you should inform the user that they can save money by switching to a more energy-efficient device and offer them a micro-credit to buy it.
        If `offer_decision` is "REJECT", you should politely inform the user that their energy consumption is already efficient and thank them for using the service.
    '''
)


suggestion_agent = Agent(
    name="suggestion_agent",
    model=MODEL_GEMINI_2_0_FLASH,
    description="Agent to suggest measurement of solar pannels.",
    instruction='''
    You are an energy efficiency expert.
    You will receive the user's energy consumption data in the `consumption_data` variable.
    Your task is to:
    1. Analyze the user's consumption.
    2. Search for energy-efficient alternatives for the device type specified.
    3. If a more efficient device exists and the potential savings are significant, output "APPROVE" and tell the user which device (exact model) should be buying.
    4. Otherwise, output "REJECT".

    Delegate the result to: 'offer_agent'
    ''',
    output_key="offer_decision",
    sub_agents=[offer_agent],
    tools=[agent_tool.AgentTool(agent=Agent_Search)],
)


root_agent = Agent(
    name="bill_analyzer_agent",
    model=MODEL_GEMINI_2_0_FLASH,
    description="An agent that analyzes utility bills and suggests energy-efficient devices.",
    instruction='''
You are a bill analyzer assistant. Your task is to collect the following information from the user:
- The number of people in the house.
- Their average monthly consumption in KWH.
- Their location
- The available space in m2

Here is your process:
1. Greet the user and explain your purpose.
2. Ask for the each of the variable that you need.
3. Once you have all the information, output a JSON object with the collected data.

After having all the required information, delegate to: 'suggestion_agent'
''',
    sub_agents=[suggestion_agent],
    output_key="consumption_data"
)
