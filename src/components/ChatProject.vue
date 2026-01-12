<template>
    <div>
        <label class="empty" :key="unreadMessages">You have ({{ this.model.getUnreadMessages() }}) unread messages</label>
    </div>
    <div class="btn-container" style="margin-top: 10px;">
        <button class="btn btn-primary" @click="openMessagePopup">View messages</button>
    </div>

    <!-- MODAL: View messages -->
    <div v-if="showMessageModel" class="modal-backdrop" @click.self="closeMessagePopup">
      <div class="modal" role="dialog" aria-modal="true" aria-label="Add meeting">
        <div class="modal-header">
          <h3 class="modal-title">Messages</h3>
          <button class="btn btn-ghost" @click="closeMessagePopup" aria-label="Close">✕</button>
        </div>
        <div>
          <div ref="chatContainer" class="chat-container">
                <div v-for="message in this.model.getMessages()" :key="message.id">
                    <div>
                          <div v-if="message[6] == this.model.getCurrentUser().name" class="message-container response-container">
                                          <label class="response-name">You</label>
                                          <div class="message response">
                                          <span> {{ message[4] }}</span>
                                          </div>
                          </div>
                          <div v-else class="message-container">
                          <label class="response-comment">{{ message[6] }}</label>
                                          <div class="message">
                                          <span> {{ message[4]}}</span>
                                          </div>
                          </div>
                    </div>
                </div>
          </div>
        </div>
        <div class="send-message-container">
            <label class="field">
                <input v-model="newMessage.content" type="text" placeholder="Message" ref="messageInput" />
                <button class="btn btn-primary" @click="sendMessage" :disabled="isSendDisabled">Send</button>
          </label>
        </div>
      </div>
    </div>
    
</template>

<script>

    export default {
        props: ["model"],
        data() {
            return {
                unreadMessages: this.model.getUnreadMessages(),
                showMessageModel: false,
                isSendDisabled: true,
                newMessage: {
                    content: ''
                },
                updateVar: false
            }
        },
        
        methods: {
            openMessagePopup() {
                this.showMessageModel = true
                window.addEventListener('keydown', this.handleKeyDown);
                this.scrollToBottom();
                this.readAllMessages();

              this.$nextTick(() => {
                this.$refs.messageInput?.focus?.();
              });

            },
            closeMessagePopup() {
                this.showMessageModel = false;
                window.removeEventListener('keydown', this.handleKeyDown);
            },
            handleKeyDown(e) {
                if (e.key === 'Escape') {
                    this.closeMessagePopup();
                }
            },
            readAllMessages() {
                this.model.readAllMessages();
                this.unreadMessages = 0;
            },
            sendMessage() {
              this.model.sendMessage(this.newMessage.content)
              this.updateVar = !this.updateVar;
              this.newMessage.content = "";
              this.scrollToBottom();
            },
            scrollToBottom() {
              this.$nextTick(() => {
              const chatBox = this.$refs.chatContainer.lastElementChild;
              chatBox.scrollIntoView({ block: 'end' });
              });
            }
        },
        watch: {
            'newMessage.content'(txt) {
                if(txt.length == 0) {
                    this.isSendDisabled = true
                }
                else {
                    this.isSendDisabled = false
                }
            },

            'model.getCurrentProjectId()'(id) {
                this.unreadMessages = this.model.getUnreadMessages()
            }
        }
    }
</script>

<style scoped>
.send-message-container {
    padding: 10px;
}
/*.send-message-container input {
}
.send-message-container button {
    
}*/

.message-container {
  display: block;
  width: 85%;
  margin-left: auto;
  margin-right: 0;
}

.response-container {
  margin-left: 0;
  margin-right: auto;
}

.message {
  background-color: #aebdf7;
  padding: 10px;
  border-radius: 12px;
}

.response {
  /*width: calc(100% - 30px);*/
  background-color: white;
  border: 3px solid lightgray;
    
  /*text-align: right;*/
}

.response-name {
    width: calc(100% - 5px);
    text-align: left;
    display: inline-block;

    margin-top: 10px;
    margin-bottom: 5px;
}

.response-comment {
    width: 100%;
    text-align: left;
    display: block;
    
    margin-left: 5px;
    margin-top: 10px;
    margin-bottom: 5px;
}

.chat-container {
    width: 80%;
    margin-left: 10%;
    height: 300px;
    overflow-y: scroll;
    overflow-x: hidden;
}

/* Open button */
.openBtn {
  background-color: #2563eb;
  color: white;
  font-weight: 700;
  font-size: 1rem;
  padding: 0.55rem 1rem;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  transition: background-color 120ms ease, transform 120ms ease;
}

/* Overlay */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);

  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

/* Popup */
.popup {
  background: white;
  width: min(680px, 100%);
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.22);
}

/* Header */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}
.header h4 {
  margin: 0;
  font-size: 18px;
}
.x {
  border: none;
  background: transparent;
  font-size: 18px;
  cursor: pointer;
}

/* Input */
input {
  width: 100%;
  box-sizing: border-box;
  padding: 12px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  outline: none;
  font-size: 14px;
}
input:focus {
  border-color: #94a3b8;
  box-shadow: 0 0 0 4px rgba(148, 163, 184, 0.35);
}

.meta {
  margin: 10px 0 8px;
  font-size: 12px;
  color: #6b7280;
}

.results {
  list-style: none;
  padding: 0;
  margin: 10px 0 0;
  border: 1px solid #eef2f7;
  border-radius: 14px;
  overflow: hidden;
}

.resultRow + .resultRow {
  border-top: 1px solid #eef2f7;
}

/* Clickable row */
.resultItem {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 12px;
  background: white;
  cursor: pointer;
  transition: background 120ms ease, box-shadow 120ms ease;
}
.resultItem:hover {
  background: #f8fafc;
}

/* Selected highlight */
.resultItem.selected {
  background: #eef6ff;
  box-shadow: inset 0 0 0 2px rgba(59, 130, 246, 0.25);
}

.left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.resultName {
  font-weight: 700;
  font-size: 14px;
}

.sub {
  font-size: 12px;
  color: #6b7280;
}

/* Highlight match */
.hl {
  background: #fff3bf;
  padding: 0 3px;
  border-radius: 6px;
}

.right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.badge {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  color: #334155;
  background: #f8fafc;
  white-space: nowrap;
}

/* Join button on selected row */
button:hover {
  background-color: #1d4ed8;
  transform: translateY(-1px);
}

.joinBtn {
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid #dbeafe;
  background: #2563eb;
  color: white;
  cursor: pointer;
}
.joinBtn:hover {
  filter: brightness(0.95);
}

/* Hints */
.hint {
  color: #6b7280;
  margin-top: 10px;
}

/* Footer */
.footer {
  margin-top: 14px;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.closeBtn,
.joinFooterBtn {
  background-color: #2563eb;
  color: white;
  font-weight: 700;
  font-size: 1rem;
  padding: 0.55rem 1rem;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  transition: background-color 120ms ease, transform 120ms ease;
}

.joinFooterBtn {
  border-color: #dbeafe;
}

.joinFooterBtn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.empty {
  padding: 10px 12px;
  margin-top: 8px;
  color: #64748b;
}

.button-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 12px;
}

.btn-container {
  min-width: 144px;
}

.btn {
  border: 1px solid #e2e8f0;
  background: #ffffff;
  color: #0f172a;
  padding: 10px 14px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 800;
  transition: background 160ms ease, transform 160ms ease, box-shadow 160ms ease, opacity 160ms ease;
}

.btn:hover {
  background: #f1f5f9;
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(2, 6, 23, 0.08);
}

.btn-primary {
  background: #2563eb;
  border-color: #2563eb;
  color: white;
}

.btn-primary:hover {
  background: #1d4ed8;
  border-color: #1d4ed8;
}

.btn-ghost {
  background: transparent;
  border-color: transparent;
  color: #0f172a;
}

.btn-ghost:hover {
  background: rgba(37, 99, 235, 0.14);
  border-color: transparent;
  box-shadow: none;
  transform: none;
}

div.btn-spacer {
  display: inline-block;
  width: 8px;
}

/* Danger button */
.btn-danger {
  background: #dc2626;
  border-color: #dc2626;
  color: white;
}
.btn-danger:hover {
  background: #b91c1c;
  border-color: #b91c1c;
}

/* Disabled */
.btn:disabled {
  cursor: not-allowed;
  opacity: 0.55;
  box-shadow: none;
  transform: none;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
  z-index: 9999;
}

.modal {
  width: max(520px, 60%);
  max-width: 100%;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(2, 6, 23, 0.25);
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 16px 10px;
}

.modal-title {
  margin: 0;
  font-size: 18px;
  letter-spacing: -0.02em;
}

.modal-body {
  padding: 10px 16px 16px;
  display: grid;
  gap: 12px;
}

.field {
  display: grid;
  grid-template-columns: 80% 20%;
  gap: 6px;
}

.field-label {
  font-size: 13px;
  font-weight: 800;
  color: #334155;
}

/* Inputs */
input[type="text"],
input[type="date"],
input[type="time"] {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 14px;
  box-sizing: border-box;
  height: 44px;
  background: #fff;
  appearance: none;
  -webkit-appearance: none;
}

input:focus {
  outline: none;
  border-color: rgba(37, 99, 235, 0.6);
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 0 16px 16px;
}

/* Hint text */
.hint {
  margin: 0;
  font-size: 13px;
  color: #64748b;
}
</style>
