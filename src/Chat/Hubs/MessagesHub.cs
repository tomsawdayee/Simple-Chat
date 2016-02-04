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
        private readonly static List<Tuple<string, string>> _chatConnections = 
            new List<Tuple<string, string>>();

        public override Task OnDisconnected(bool stopCalled)
        {
            _chatConnections.RemoveAll(x => x.Item1 == Context.ConnectionId);
            Clients.All.updateUsers(_chatConnections);
            return base.OnDisconnected(stopCalled);
        }
        public override Task OnConnected()
        {
            var name = Context.QueryString["name"].ToString();
                _chatConnections.Add(Tuple.Create(Context.ConnectionId, name));

            Clients.All.updateUsers(_chatConnections);

            return base.OnConnected();
        }
    }
}
