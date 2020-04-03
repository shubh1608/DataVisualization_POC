import csv
import pika
import pandas as pd

class Broker:
    def init_queue(self, queue):
        if queue == "rabbitmq":
            return RabbitMQ()
        if queue == "kafka":
            return Kafka()

# interface for queue
class Queue:
    def push(self):
        pass

class RabbitMQ(Queue):

    #creating connection to rabbitMQ
    connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
    channel = connection.channel()
    queue_name = "calldetailsqueue"
    args ={
        "queue-mode":  "lazy",
        "max-length" : "500"
    }
    channel.queue_declare(queue=queue_name, arguments=args)
    print("Declared queue with name : {0}".format(queue_name))

    def push(self, msg):
        self.channel.basic_publish(exchange='', routing_key="calldetailsqueue", body=msg)

class Kafka(Queue):

    #to-do: make connection to Kafka

    def push(self, msg):
        #to-do: push msg to queue
        pass