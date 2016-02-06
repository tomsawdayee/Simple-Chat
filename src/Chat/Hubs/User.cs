using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Chat.Hubs
{
    public class User
    {
        public string ConnectionId { get; set; }
        public string Username { get; set; }
    }
}
