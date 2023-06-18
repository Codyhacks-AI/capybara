from dotenv import load_dotenv
load_dotenv()

import os
import openai
import json

openai.api_key = os.getenv("OPENAI_API_KEY")

# Variable Declarations
prompt = "You are the best extension for an IDE called VSCode and you are currently reviewing your engineer's code in live time. You are looking for naming conventions that are not up to par with the best practices. You are looking for lines that have wrong naming conventions for different classes, functions, parameters, types, and etc. You want to give your new engineer feedback on how to name these methods. Give line numbers and comments. The next prompt you get will be all of the file code."

# This is the input on save
file_path = "./data/temp.ts" 
with open(file_path, "r") as file:
  code = file.read()

def identify_naming_conventions(input_code):
  messages = [
    {"role": "system", "content": prompt},
    {"role": "user", "content": input_code}
  ]
  functions = [{
    "name": "highlight_poor_naming_conventions",
    "description": "This is a function on the frontend service that will take in lines of code and comments for the parts of the code that have poor naming convention, and then highlight them yellow on the frontend.",
    "parameters": {
        "type": "object",
        "properties": {
            "lines": {
              "type": "array",
              "items": {
                "type": "number",
                "description": "This is a list of line numbers that correspond to the lines that have poor naming conventions. The index of this list corresponds to the index of the comments list.",
              }
            },
            "comments": {
              "type": "array",
              "items": {
                "type": "string",
                "description": "This is a list of comments and explanations that correspond to the lines that have poor naming conventions. The index of this list corresponds to the index of the lines list.",
              }
            },
        },
        "required": ["lines", "comments"],
    }
  }]

  response = openai.ChatCompletion.create(
    model="gpt-4-0613",
    messages=messages,
    functions=functions,
    function_call={"name": "highlight_poor_naming_conventions"}
  )

  response_message = response["choices"][0]["message"]

  return response_message

print(identify_naming_conventions(code))