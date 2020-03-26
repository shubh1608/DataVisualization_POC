import pika
import ast
import json

def receive_messages(ch, method, properties, body):
    record = json.loads(body)
    print(record)

connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
channel = connection.channel()
channel.queue_declare(queue='q1')
channel.basic_consume(queue='q1', auto_ack=True, on_message_callback=receive_messages)

print(' [*] Waiting for messages. To exit press CTRL+C')
channel.start_consuming()
