# Lunamals

A host-your-own virtual pet community and game.

# Developing Lunamals

The service is broken into several microservices and shared libraries, the majority of which are nodejs.  In reality, it doesn't matter what language as service is built in as long as it follows 3 rules

- communicates events using amqp, everything else over HTTP
- any API exposed is REST-like, including internal APIs
- the service can be configured live with consul

The project is designed around supporting high horizontal scalability and asynchronous processing so that the only limits to performance and size is the hardware you have available to run the system.  Under ideal conditions, Lunamals should be able to scale to support thousands of requests per second and millions of users through proper configuration on AWS with autoscaling groups.

We're focused on creating a game with community, and with the cost of very specific business logic comes that impact of very little code reusability.  However, we try not to reinvent the wheel when it's not necessary, hence why for bigger features we try to rely on existing tested software that is reusable, ie. Discourse for the forums.  Limiting the amount of services we write that other people have made dozens of times already is ideal, because there's enough we have to worry about already with Lunamals specific code.  

If you can think of a way to implement a feature in Lunamals using an existing, well supported, easy to deploy, scalable open-source project instead, go for it.

# Scheduling tasks

We use RunDeck.  Place job definitions in a projects `etc/rundeck` directory, and the rundeck crawler script provided with lunamals will add all of them.  It's then up to you to go into rundeck and point the jobs to the proper instances/resources in case the jobs need to access the services on something other than localhost.  It's recommended you run 2 instances of the api gateway, one for public access and another for internal resources to keep configuration simple.

# Handling Auth

All auth and user information should be provided/maintained through the JWT.  Services should determine how to associate data with users within their own logic accordingly.

# Stats and Logging

Use statd for producing standardized monitoring.  Feel free to set something up like Graphene to monitor the stats.  Logging should be to file and/or compatible with collection by GreyLog.

# Configuring Microservices with Envoy

Still trying to figure this out myself