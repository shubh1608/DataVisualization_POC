import csv
import pika
import pandas as pd
import sys
import threading
from time import time
from messagebroker import RabbitMQ

file_loc = '..//Sample_Data//split//'

agent_count = int(sys.argv[1])
print("Total agents: {0}".format(agent_count))
csv_file_cnt = 27
chunk_size = 1

class Agent:
    def __init__(self):
        self.queue = RabbitMQ()

    def read_csv(self, file_array, channel):
        for i in file_array:
            filename = "{0}test_{1}".format(file_loc,i)
            for chunks in pd.read_csv(filename, chunksize = chunk_size):
                #pre processing
                chunks.columns = chunks.columns.str.lower().str.replace("`", "").str.replace(" ","")
                chunks['created'] = chunks['created'].str.replace("'", "")
                chunks['src'] = chunks['src'].str.replace("'", "")
                chunks['dst'] = chunks['dst'].str.replace("'", "")
                json_chunk = chunks.to_json(orient = 'records')

                #push to queue
                self.queue.push(channel,json_chunk)
        
        print("{0} is done with reading files".format(threading.current_thread().name))

    def create_agents(self):
        csv_file_idx = [i for i in range(1,csv_file_cnt+1)]
        file_grp_cnt = int(csv_file_cnt/agent_count)
        start = 0
        end = 0
        threads = []
        for i in range(1, agent_count+1):
            end = file_grp_cnt*i
            arr = csv_file_idx[start:end]
            start = end
            thread_name = "agent_{0}".format(i)
            channel = self.queue.create_channel(thread_name)
            t = threading.Thread(target=self.read_csv, name= thread_name, args=(arr,channel,))
            threads.append(t)

        start_time = time() 
        #start thread and log info
        for t in threads:
            print("{0} started".format(t.name))
            t.start()
            
        for t in threads:
            t.join()

        end_time = time()
        elapsed_time = (end_time-start_time)/60
        print("agents finished reading records")
        print("total time taken: {0}".format(elapsed_time))


agent = Agent()
agent.create_agents()