# Scalable DataPipeline

#### Project Status: [Active]

## Project Intro/Objective
* This is a short project where you can get a feel of working in scalable data pipelines. 
* I was asked to work on a POC where i have to showcase 
   1. Big data handling skills.
   2. Efficient and scalable storage.
   3. Data Visualisation skills.
   4. Decoupled Architecture
* This project work is a part of POC.


### Technologies
* Python
* Pandas, Pika
* RabbitMQ
* Java, Maven, Spring Boot
* Cassandra
* HTML
* JavaScript

## Project Description
* Multiple agents/devices can push data simultaneoulsy to the server, which is first received using message broker, in our case we are using RabbitMQ. There is a Consumer which is responsible for receving data from queue and it will store the data in Cassandra. Data stored in Cassandra is exposed using Rest APIs and it is consumed by UI where we are visualising the data.

### Components Details
1. Agent
   * This is developed using python and is used for simulating the real environment where data comes from multiple sources, for simulation we are using agents to read time series data from a large CSV file. Agent will read a single record and push this to the message broker. Agent script is parameterized, details are as below:
   * Number of Agents : how many agents we want to have to simulate our incoming data env. Multiple agents will run in different thread so essentially msgs/sec rate will be more if we have more agents.
   * disk_chunk_size: Number of records to read from disk to memory at once, reading each record from disk and push to queue will have less msgs/sec incoming rate in RabbitMQ. Experiment with this number to see the effect on msgs/sec rate. Example: use 1000 or more as per your ram capacity and number of agents for high msgs/sec rate.
   * message_size: This represents the number of record to push to queue at once, if it is 1 then only 1 record will be pushed by agent, it it is 50 then 50 records will push to queue in a single message.
   
2. Message Broker
   * We are using RabbitMQ as a message broker for reliable data exchange between publishers and subscribers, using message brokers helps in decoupling our data stream, providing more scalability, high volume handling capacity and maintaining high throughput.
   * NOTE: If the amount of data we are looking to consume is very large and demands high performance, fault tolerance and throughput then Apache Kafka is proven to be the best among the rest out there.
   
3. Consumers
   * This is responsible for consuming data from RabbitMQ and it is developed using Java and maven for dependency management. 
   * Multiple consumers can be used, this application also use a parameter- Consumer count, set this value to how many consumers you want. If you many agents or high data incoming rate, Then you may want to increase the number of consumers. NOTE: Each consumer will use single TCP connection but multiple channels(light weight TCP connection), as recommended by RabbitMQ.
   * After consuming the data from the queue, consumers will open a connection to Cassandra and insert records in the table. Connection to cassandra is also multi threaded with the default configuration of min pool size equal to number of cores in a node and maximum pool size can be set to some value.
   
4. Cassandra
   * Apache Cassandra is a highly scalable, high-performance distributed database designed to handle large amounts of data across many multiple servers, providing high availability with no single point of failure. It is a type of NoSQL database.
   * Data modelling is very important to store high amounts of data effectively, ideal way is to figure out the types of query you want to perform in cassandra. According to query you want to model your data, which means deciding your partition keys, cluster keys and so on.
   
5. Visualization
   * API - For exposing the data stored in Cassandra, we are using Rest APIs which are developed in Java using Spring Boot framework. This will fetch data from db as per the query parameters, process it and provide the results to UI in json format.
   * UI - HTML and Javascript based user interface for displaying the trends in data, it will consume the json data by calling the Rest APIs.


## Needs of this project
- Data Engineer
- Python Developer
- FrontEnd & BackEnd Developer

## Getting Started
1. Clone this repo (for help see this [tutorial](https://help.github.com/articles/cloning-a-repository/)).
2. Source your data first, you can experiment with time series data which should be in csv format. For example This agent reads data from a large csv file which has information for 6 columns.
3. Modify agent as per your data.(assuming you have python installed in your system, download the libraries as well used in agents).
4. Setup RabbitMQ, and admin tool which will be used for monitoring the performance.
5. Install Cassandra and setup cqlsh(cassandra query language)
6. Install Java runtime, SDK, maven. Maven will install further dependencies.
7. Install and setup Tomcat server for running Java Spring boot Rest APIs
8. Install Node Http-server, easy to use for UI.
9. After installation first start Consumer, see message in console it it is up and running
10. Then run agent and provide parameter as needed.
11. check RabbitMQ Admin web interface for queue status. It will show you incoming msgs/sec and outgoing msgs/sec. Ideally queue size will be zero.
12. Experiment with the architecture(number of agents, disk chunk size, message size and consumers) and change queue configuration as needed. Default is lazy queue with transient messages for better throughput.


## Contact
* Shubham Patel, email: shubhampatel1608@gmail.com, mobile: 8103856241

