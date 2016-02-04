using Chat.Hubs;
using Chat.Models;
using Microsoft.AspNet.Mvc;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Chat.Controllers.Api
{
    [Route("api/messages/[action]")]
    public class MessagesController
    {
        private IHubContext _hub;
        public MessagesController(IConnectionManager connectionManager)
        {
            _hub = connectionManager.GetHubContext<MessagesHub>();
        }

        [HttpPost]
        public Message SendMessage(string username, string text, string toUser = null)
        {
            var message = new Message
            {
                FromUser = username,
                Text = text
            };

            _hub.Clients.All.receiveMessage(message);

            return message;
        }
    }
}
