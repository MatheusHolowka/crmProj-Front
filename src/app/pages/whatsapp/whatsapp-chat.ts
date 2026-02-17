import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Sidebar } from '../../components/sidebar/sidebar'; // Ajustado conforme Personal File src/app/pages/whatsapp/
import { Theme } from '../../services/theme';

@Component({
  selector: 'app-whatsapp-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, Sidebar],
  templateUrl: './whatsapp-chat.html',
  styleUrls: ['./whatsapp-chat.css']
})
export class WhatsappChat implements OnInit {
  private http = inject(HttpClient);
  public theme = inject(Theme);
  
  chats = signal<any[]>([]);
  selectedChat = signal<any>(null);
  messages = signal<any[]>([]);
  isConnected = signal<boolean>(true);
  newMessage = '';

  ngOnInit() {
    this.mockData();
  }

  mockData() {
    this.chats.set([
      { id: '1', name: 'Lead: Matheus Holowka', lastMessage: 'Olá, vi o CRM!', time: '09:41' },
      { id: '2', name: 'Fazenda Planalto', lastMessage: 'Relatório recebido', time: 'Ontem' }
    ]);
  }

  selectChat(chat: any) {
    this.selectedChat.set(chat);
    
    // Agora com horários preservados
    if (chat.id === '1') {
      this.messages.set([
        { text: 'Olá Matheus, como está o projeto?', fromMe: false, time: '09:40' },
        { text: 'Indo bem! VPS configurada hoje.', fromMe: true, time: '09:41' }
      ]);
    } else {
      this.messages.set([
        { text: 'Bom dia, Fazenda Planalto. Segue o relatório de produção.', fromMe: true, time: '08:15' },
        { text: 'Relatório recebido, obrigado!', fromMe: false, time: '08:20' }
      ]);
    }
  }

  send() {
    if (!this.newMessage.trim()) return;
    
    const msg = {
      text: this.newMessage,
      fromMe: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    this.messages.update(old => [...old, msg]);
    this.newMessage = '';
  }
}