from langchain.llms import OpenAI
from langchain.chains.question_answering import load_qa_chain
import pinecone
from langchain.embeddings import OpenAIEmbeddings

# from langchain.vectorstores import Chroma
# from langchain import OpenAI, VectorDBQA
from langchain.document_loaders import DirectoryLoader

# from langchain.document_loaders import UnstructuredFileLoader
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores import Pinecone

PINECONE_API_KEY = "a6e82686-204b-40f0-8220-a5c4d5f7d149"
PINECONE_API_ENV = "us-west1-gcp-free"
OPENAI_API_KEY = "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"

# flow
# text -> pinecone -> langchain

##### user input #####
print("LOADING DATA")
# get user code
loader = DirectoryLoader("./data/", glob="**/*.txt", show_progress=True)

documents = loader.load()
# documents = ""  # get user code
# chunk and split
text_splitter = CharacterTextSplitter(
    chunk_size=1000, chunk_overlap=0
)  # play around with chunk_size, chunk_overlap

texts = text_splitter.split_documents(documents)

# generate embeddings from `texts`
embeddings = OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY)


##### pinecone #####
print("INIT PINECONE")
# initialize pinecone database
pinecone.init(api_key=PINECONE_API_KEY, environment=PINECONE_API_ENV)
index_name = "test"

docsearch = Pinecone.from_texts(
    [t.page_content for t in texts], embeddings, index_name=index_name
)


##### langchain #####
print("INIT LANGCHAIN")
# initialize llm
llm = OpenAI(temperature=0.9, openai_api_key=OPENAI_API_KEY)

# create chain for llm
chain = load_qa_chain(llm)

query = "According to best practices. Tell me what lines have wrong naming conventions and resuable code. Give me line numbers and comments. Send no other text. Only respond with the line and comment. Follow the JSON format: [{line: number, comment: string}]"

# generate context via semantic search -> store in docs
docs = docsearch.similarity_search(query)

# call the chain to query the llm with both query and context(docs)
print(chain.run(input_documents=docs, question=query))


print(
    llm.predict(
        "What would be a good company name for a company that makes colorful socks?"
    )
)
