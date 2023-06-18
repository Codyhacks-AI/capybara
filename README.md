# Capybara

## 🤩 Inspiration / Problem 
### Problem
Managing large-scale CS programs and code bases. Assessing code quality is typically constrained by limited resources but important for high standards of education quality and industry development.

### Inspiration
Leading UC Berkeley's Data Structures and Algorithms Course (CS61B), we reached limitations for our staff's capacity. Constrained by a budget crisis, layoffs, and strikes, UC Berkeley was forced to cut new admissions by over 75%. We firmly believe in democratizing education, and are determined to eliminate any bottlenecks obstructing our mission. We want to foster the next generations of builders at scale, leaving no aspiring learner behind.

What we need is more manpower to teach... or do we? 

This is the power of AI; This is thinking outside the box. This is Capybara.

## ⚙️ What is Capybara?
Capybara is an AI-powered VSCode extension that uses LLM technology to provide insightful suggestions into code quality. On saving any code file, it interfaces with OpenAI's API to find poorly written code blocks and suggest detailed improvements. The extension also brings in AI to judge the programmer's experience level so that it can make well-suited recommendations for their skill level. Additionally, a chat feature allows users to interact and discuss highlighted sections of code.

https://github.com/Codyhacks-AI/capybara/assets/50549133/01eae160-c6fd-4cc8-8294-d7275be8ed30

## 🚧 Why Capybara?
Capybara helps learning programmers and professionals alike to evaluate their code style, program defensively, and catch elusive bugs.

In CS education, assessing and providing feedback on code quality is a task that requires many human-hours to perform. However, the effects of neglecting code quality can be immense as developing programmers enter their early careers. Even professionals face consistent issues with tech debt and inefficiencies in their codebases. With AI-powered technology and rapid developing capabilities, like OpenAI's function calling that was released last week, efficient solutions like Capybara are on the horizon. 

## ✏️ Tech Stack
The VSCode extension is written in Typescript, leveraging OpenAI's function calling capabilities and LangChain. The extension runs each time a code document is saved, requesting OpenAI's API for code blocks to highlight and reasons why they should be improved. Utilizing VSCode's API, each code block is highlighted with hover annotations that display the suggestion. On each suggestion, there is a link to open the chatbot, which gives users the opportunity to converse about the specific suggestion and code that it is referencing. This chatbot is setup using VSCode's Webview API and Langchain.

## 🚧 Challenges
This was all of our first times ever writing a VSCode extension, utilizing OpenAI's API, or learning LangChain. The VSCode API was difficult due to the wide span of features we ended up using from command handlers to displaying custom windows for the chatbot. Additionally, we had to learn and understand the new LLM technology from scratch, then take the entire extension from ideation to implementation. Many of the concepts were very foreign to us, so we spent a lot of time reading and rereading documentation/guides.

## 🎉 Accomplishments
We have a fully functional and polished result! Originally, we had set out to only implement the code highlighting feature, but ended up also including insightful recommendations on hovering each code block and a chatbot feature to make the experience way more interactive. Throughout the process, we experimented with many different approaches and although not all of them worked out, each of them gave us a new perspective on LLM tech!

## 🔮 What's next for Capybara
Right now Capybara works great for single file programs. But as students and their projects become more sophisticated, we want to broaden Capybara's scope to develop a comprehensive understanding an their entire codebase.

### Flask & Pinecone
In order to scale up, we are developing a Flask backend to enable Capybara to process larger codebases in an efficient manner. To save the context of an entire codebase, we will use Pinecone to track, store, and search for more accurate suggestions. With Pinecone, Capybara will continuously learn alongside our students, giving feedback that is refined and as helpful to beginners as it is to skilled developers. We're excited to ship our developments and bring them to our community!
