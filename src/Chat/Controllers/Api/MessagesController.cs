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
    }
}
