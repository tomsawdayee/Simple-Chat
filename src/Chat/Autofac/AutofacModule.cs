using Autofac;
using Raven.Client;
using Raven.Client.Document;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Chat.Autofac
{
    public class AutofacModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.Register(x =>
            {
                var store = new DocumentStore { Url = "http://localhost:8080", DefaultDatabase = "Messages" };
                store.Initialize();
                return store;
            })
             .As<IDocumentStore>()
             .SingleInstance();

            builder.Register(x => x.Resolve<IDocumentStore>().OpenSession())
                  .As<IDocumentSession>()
                  .InstancePerLifetimeScope()
                  .OnRelease(x =>
                  {
                      x.SaveChanges();
                      x.Dispose();
                  });
        }
    }
}
