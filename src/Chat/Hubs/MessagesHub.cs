using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;

namespace Chat.Hubs
{
    [HubName("messages")]
    public class MessagesHub : Hub
    {
    }
}
