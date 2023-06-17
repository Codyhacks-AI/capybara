from langchain.chat_models import ChatOpenAI
from langchain.schema import (
    AIMessage,
    HumanMessage,
    SystemMessage
)

from langchain.prompts.chat import (
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
)

chat = ChatOpenAI(
    openai_api_key="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", temperature=0)

print(chat.predict_messages([HumanMessage(
    content="Translate this sentence from English to French. I love programming.")]))

# template = "You are an expert software engineer working on this project: {project}."
# system_message_prompt = SystemMessagePromptTemplate.from_template(template)
# human_template = "Provide variable name suggestions for the following: {text}"
# human_message_prompt = HumanMessagePromptTemplate.from_template(human_template)

# chat_prompt = ChatPromptTemplate.from_messages([system_message_prompt, human_message_prompt])

# chat_prompt.format_messages(project="full-stack web app", text="""const FeedScreen = ({ navigation }: any) => {
#   const [open, setOpen] = useState(false);
#   const [list, setList] = useState([] as Job[]);
#   const [filteredList, setFilteredList] = useState([] as Job[]);
#   const [category, setCategory] = useState('all');.""")

# print(chat.predict_messages(chat_prompt))
