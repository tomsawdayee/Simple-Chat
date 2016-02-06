using Chat.Models;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Chat.Hubs
{
    [HubName("messages")]
    public class MessagesHub : Hub
    {
        private readonly static List<User> _chatConnections = new List<User>();

        public void SendMessage(string username, string text, string toUser = null)
        {
            var message = new Message
            {
                FromUser = username,
                FromUserConnectionId = Context.ConnectionId,
                Text = text
            };
            if (string.IsNullOrEmpty(toUser))
                Clients.All.receivePublicMessage(message);
            else
                Clients.Client(toUser).receivePrivateMessage(message);
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            _chatConnections.RemoveAll(x => x.ConnectionId == Context.ConnectionId);
            Clients.All.userDisconnected(Context.ConnectionId);
            return base.OnDisconnected(stopCalled);
        }
        public override Task OnConnected()
        {
            var name = Context.QueryString["name"].ToString();
                _chatConnections.Add(new User { ConnectionId = Context.ConnectionId, Username = name });

            Clients.Client(Context.ConnectionId).refreshList(_chatConnections);

            Clients.AllExcept(Context.ConnectionId).userConnected(Context.ConnectionId, name);
            return base.OnConnected();
        }
    }
}
