import csv
import pika
import pandas as pd

class RabbitMQ:

    def create_channel(self, thread_name):
        connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
        channel = connection.channel()
        queue_name = "calldetailsqueue"
        args ={
            "queue-mode":  "lazy",
            "max-length" : "50000"
        }
        channel.queue_declare(queue=queue_name, arguments=args)
        print("created channel for thread: {0} and queue: {1}".format(thread_name ,queue_name))
        return channel

    def push(self, channel, msg):
        channel.basic_publish(exchange='', routing_key="calldetailsqueue", body=msg)
