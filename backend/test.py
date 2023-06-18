from langchain.llms import OpenAI
from langchain.chains.question_answering import load_qa_chain
from langchain.embeddings import OpenAIEmbeddings
# from langchain.vectorstores import Chroma
# from langchain import OpenAI, VectorDBQA
from langchain.document_loaders import DirectoryLoader

# from langchain.document_loaders import UnstructuredFileLoader
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores import Pinecone
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
import pinecone

PINECONE_API_KEY = "a6e82686-204b-40f0-8220-a5c4d5f7d149"
PINECONE_API_ENV = "us-west1-gcp-free"

# flow
# text -> pinecone -> langchain

##### user input #####
print("LOADING DATA")
# get user code
loader = DirectoryLoader("./data/", glob="**/*.txt", show_progress=True)

documents = loader.load()
print(f"{documents[0].page_content}")

# chunk and split
text_splitter = CharacterTextSplitter(
    chunk_size=1000, chunk_overlap=0
)  # play around with chunk_size, chunk_overlap

docs = text_splitter.split_documents(documents)

# generate embeddings from `texts`
embeddings = OpenAIEmbeddings()


##### pinecone #####
print("INIT PINECONE")
# initialize pinecone database
pinecone.init(api_key=PINECONE_API_KEY, environment=PINECONE_API_ENV)
index_name = "test"

# docsearch = Pinecone.from_texts(
#     [t.page_content for t in texts], embeddings, index_name=index_name
# )
docsearch = Pinecone.from_documents(docs, embeddings, index_name=index_name)

##### langchain #####
print("INIT LANGCHAIN")
# initialize llm
llm = OpenAI(temperature=0.1)

# create chain for llm
# chain = load_qa_chain(llm)

prompt_template = """You are an expert coder. Some current code includes the below:
    {context}
    
    You just wrote this new code: {new_code}
    Give suggestions on improvements for the new code.
    Give me line numbers and comments. Send no other text. Only respond with the line and comment. 
    """

PROMPT = PromptTemplate(template=prompt_template, input_variables=["context", "new_code"])

chain = LLMChain(llm=llm, prompt=PROMPT)
query = """
number_ans = func_z(15)
whyCamelCase = func_y(["hi"])
input = "this line is fine"
idk = "this is bad"
"""

# generate context via semantic search -> store in docs
def answer(new_code):
    docs = docsearch.similarity_search(new_code)
    combined = ""
    for doc in docs:
        combined += doc.page_content + "/n"
    print(combined)
    inputs = [{"context": combined, "new_code": new_code}]
    print(chain.apply(inputs))

answer(query)
# call the chain to query the llm with both query and context(docs)
#print(chain.run(input_documents=docs, question=query))

