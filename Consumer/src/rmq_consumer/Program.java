package rmq_consumer;

import com.rabbitmq.client.*;

public class Program {

	public static void main(String[] args) {

		CassandraConnector client = null;
		try {

			int consumer_count = Integer.parseInt(args[0]);
			client = new CassandraConnector();
			client.connect("localhost", 9042);
			client.SetupKeySpace();

			CallDetailsRepository repo = new CallDetailsRepository(client.getSession());

			Queue queue = new Queue(repo, consumer_count);
			
			for(int i=0; i< consumer_count; i++) {
				Channel c = queue.CreateChannel();
				queue.Subscribe(c);
			}

		} catch (Exception e) {
			client.close();
			System.out.println("Stopping application." + e.getStackTrace());
		}

	}

}
