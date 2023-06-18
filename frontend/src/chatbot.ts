import * as vscode from 'vscode';

export const openChatBot = () => {
  const panel = vscode.window.createWebviewPanel(
    'customContainer',
    'Custom Container',
    { preserveFocus: true, viewColumn: vscode.ViewColumn.Two },
    { enableScripts: true }
  );
  panel.webview.html = getWebviewContent();
  panel.webview.onDidReceiveMessage(message => {
    if (message.command === 'sendMessage') {
      const text = message.text;
      // Call your callback function with the received message text
      vscode.window.showInformationMessage(text);

    }
  });
};

function getWebviewContent(): string {
  return `
    <html>
      <body>
        <h1>Chat Box</h1>
        <input type="text" id="messageInput" placeholder="Type your message..." />
        <button onclick="sendMessage()">Send</button>

        <script>
          const vscode = acquireVsCodeApi();

          function sendMessage() {
            const messageInput = document.getElementById('messageInput');
            const message = messageInput.value;

            // Call the callback function in the extension
            vscode.postMessage({ command: 'sendMessage', text: message });

            // Clear the input field
            messageInput.value = '';
          }
        </script>
      </body>
    </html>
  `;
}