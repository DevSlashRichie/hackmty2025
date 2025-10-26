
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

from google.adk.agents import Agent, LlmAgent
from google.adk.agents import SequentialAgent

MODEL_GEMINI_2_0_FLASH = "gemini-2.0-flash"


verdict_agent = Agent(
    name="verdict_agent",
    model=MODEL_GEMINI_2_0_FLASH,
    description="Agent to give the final verdict on the loan application.",
    instruction="""
        You are a loan officer.
        You will be given the result of a loan evaluation in the `valid_loan` variable.

        If `valid_loan` is "APPROVE", you should inform the user that their loan has been approved.
        If `valid_loan` is "REJECT", you should politely inform the user that their application was not approved at this time and say goodbye.
    """
)


evaluation_agent = Agent(
    name="evaluation_agent",
    model=MODEL_GEMINI_2_0_FLASH,
    description="Agent to conduct if a business is feasible to give a loan.",
    instruction="""
    You are a loan evaluator.
    Evaluate if the following data matches to a possible loan: {business_info}.
    Based on the evaluation, you must output a single word: "APPROVE" if the loan should be granted, or "REJECT" if it should not.
    Output *only* the word "APPROVE" or "REJECT".

    then output *only* yes or no.
    
    After having all the required delegate to: 'verdict_agent'
    """,
    output_key="valid_loan",
    sub_agents=[verdict_agent]
)

#root_agent = SequentialAgent(
#    name="LendingAgentPipeline",
#    sub_agents=[introduction_agent, evaluation_agent, verdict_agent],
#    description="Executes a sequence of doing a loan evaluation."
#)

root_agent = Agent(
    name="introduction_agent",
    model=MODEL_GEMINI_2_0_FLASH,
    description="An agent which conducts the introduction with the user. Will present and ask questions.",
    instruction="""
You are a loan officer. Your task is to collect the following information from the user:
- Average monthly earnings.
- The amount of money they need.
- A description of their business.

Here is your process:
1. Review the conversation history to see what information you have already collected.
2. If you have collected all three pieces of information, your task is complete. You MUST output a JSON object with the collected data. The keys must be "earnings", "loan_amount", and "business_description". Output *only* this JSON object.
3. If you are missing one or more pieces of information, ask ONE clear question to collect ONE piece of missing information. Do not ask for more than one thing at a time. Then wait for the user's answer.

After having all the required delegate to: 'evaluation_agent'
""",
    sub_agents=[evaluation_agent],
    output_key="business_info"
)
