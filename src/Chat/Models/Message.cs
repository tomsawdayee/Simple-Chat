using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Chat.Models
{
    public class Message
    {
        public string Id { get; set; }
        public string FromUser { get; set; }
        public string FromUserConnectionId { get; set; }
        public string ToUser { get; set; }
        public string Text { get; set; }
    }
}
