package rmq_consumer;

import com.rabbitmq.client.*;

public class Program {

	public static void main(String[] args) {

		CassandraConnector client = null;
		try {

			client = new CassandraConnector();
			client.connect("localhost", 9042);
			client.SetupKeySpace();

			CallDetailsRepository repo = new CallDetailsRepository(client.getSession());

			Queue queue = new Queue(repo);

			Channel c1 = queue.CreateChannel();
			queue.Subscribe(c1);

			Channel c2 = queue.CreateChannel();
			queue.Subscribe(c2);

			Channel c3 = queue.CreateChannel();
			queue.Subscribe(c3);

			Channel c4 = queue.CreateChannel();
			queue.Subscribe(c4);

			Channel c5 = queue.CreateChannel();
			queue.Subscribe(c5);

		} catch (Exception e) {
			client.close();
			System.out.println("Stopping application." + e.getStackTrace());
		}

	}

}
