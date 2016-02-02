using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;
using Raven.Client;
using Chat.Models;

namespace Chat.Controllers
{
    public class HomeController : Controller
    {
        public IDocumentSession _documentSession { get; set; }
        public HomeController(IDocumentSession documentSession)
        {
            _documentSession = documentSession;
        }
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Error()
        {
            return View();
        }
    }
}
