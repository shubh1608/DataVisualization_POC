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
    channel.queue_declare(queue='q1')

    def push(self, msg):
        self.channel.basic_publish(exchange='', routing_key='q1', body=msg)
        print("Sent!!!")

class Kafka(Queue):

    #to-do: make connection to Kafka

    def push(self, msg):
        #to-do: push msg to queue
        pass