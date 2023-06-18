import * as vscode from "vscode";
import { WebviewData } from "../types";
import LangChain, { startCodeCommentChat } from "../api/langchain";

export const openChatBot = ({ document, block }: WebviewData) => {
  const chain = startCodeCommentChat(
    document,
    block.comment,
    block.startLine,
    block.endLine,
  );

  const activeEditor = vscode.window.activeTextEditor;
  if (activeEditor && activeEditor.viewColumn) {
    const viewColumnForChat =
      activeEditor.viewColumn === vscode.ViewColumn.Two
        ? vscode.ViewColumn.One
        : vscode.ViewColumn.Two;
    const panel = vscode.window.createWebviewPanel(
      "chat",
      "Chat",
      { preserveFocus: true, viewColumn: viewColumnForChat },
      { enableScripts: true },
    );
    panel.webview.html = getWebviewContent(block.comment);

    panel.webview.onDidReceiveMessage(async (message) => {
      if (message.command === "sendMessage") {
        const res = await LangChain.callChain({
          input: message.text,
          chain,
        });
        panel.webview.postMessage({ command: "handleResponse", text: res });
      }
    });
  }
};

function getWebviewContent(comment: string): string {
  return `
    <head>
      <style>
        * {
          box-sizing: border-box;
        }
        html {
          margin: 0;
          height: 100%;
          width: 100%;
        }
        body {
          font-family: Arial, sans-serif;
          color: #ebebeb#;
          display: flex;
          flex-direction: column;
          margin: 0;
          padding: 0;
          height: 100%;
          width: 100%;
        }
        h1 {
          margin-left: 40px;
        }
        #comment-container {
          margin: 10px 40px;
          margin-bottom: auto;
          background-color: rgba(171, 0, 0, 0.3);
          border-radius: 4px;
          padding: 12px 20px;
        }

        #message-container {
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          height: auto;
          overflow: scroll;
          margin-top: auto;
          width: 100%;
        }
        ul {
          list-style-type: none;
          width: 100%;
        }
        .you {
          margin-left: auto;
          margin-top: 20px;
          border: 2px solid #038dff;
          border-radius: 4px;
          padding: 12px 20px;
          width: 70%;
          text-align: right;
          box-shadow: 2px 2px 5px rgba(0, 139, 255, 0.4);
        }
        .bot {
          margin-right: auto;
          margin-top: 20px;
          border: 2px solid #a13dff;
          border-radius: 4px;
          padding: 12px 20px;
          width: 70%;
          text-align: left;
          box-shadow: 2px 2px 5px rgba(161, 61, 255, 0.4);
        }

        #bottom-container {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 40px;
          margin-bottom: 60px;
        }
        #message-input {
          width: 60%;
          padding: 10px;
          margin-left: 20px;
          margin-right: 20px;
          border: 2px solid #898989;
          border-radius: 4px;
          background: transparent;
          color: white;
          max-height: 500px;
          white-space: break-spaces;
          text-decoration: none !important;
        }
        #send-button {
          background: transparent;
          color: inherit;
          border: 2px solid #ededed;
          border-radius: 20px;
          padding: 8px 14px;
          font: inherit;
          outline: inherit;
        }
      </style>
    </head>
    <html>
      <body>
        <h1>Capybaras</h1>
        <div id="comment-container">${comment}</div>
        <ul id="message-container"></ul>
        <div id="bottom-container">
          <input type="text" id="message-input" placeholder="Type your message..." />
          <button id="send-button" onclick="sendMessage()">Send</button>
        </div>
        <script>
          const vscode = acquireVsCodeApi();
          const messages = document.getElementById("message-container");

          const handleMessage = (event) => {
            const message = event.data; // The JSON data our extension sent
            switch (message.command) {
              case "handleResponse":
                const node = document.createElement("li");
                node.className = "bot";
                const textNode = document.createTextNode(message.text);
                node.appendChild(textNode);
                messages.appendChild(node);
                break;
            }
          }

          const sendMessage = () => {
            const messageInput = document.getElementById('message-input');
            const message = messageInput.value;

            // Call the callback function in the extension
            vscode.postMessage({ command: 'sendMessage', text: message });
            const node = document.createElement("li");
            node.className = "you";
            const textNode = document.createTextNode(message);
            node.appendChild(textNode);
            messages.appendChild(node);
            
            // Clear the input field
            messageInput.value = '';
          }

          window.addEventListener("message", handleMessage);
        </script>
      </body>
    </html>
  `;
}
