package rmq_consumer;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadFactory;
import java.util.concurrent.TimeoutException;

import com.google.gson.Gson;
import com.rabbitmq.client.AMQP;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import com.rabbitmq.client.DefaultConsumer;
import com.rabbitmq.client.DeliverCallback;
import com.rabbitmq.client.Delivery;
import com.rabbitmq.client.Envelope;

public class Queue {

	private String QUEUE_NAME = "q1";
	private String RabbitMQ_Server = "localhost";
	private Connection conn = null;
	private CallDetailsRepository _repo = null;
	private int ThreadPoolSize = 5;
	Gson gson = new Gson();

	public Queue(CallDetailsRepository repo) {
		ExecutorService connectionExecutor = SetupExecutorService();
		conn = SetupQueueConnection(connectionExecutor);
		_repo = repo;
	}

	private Connection SetupQueueConnection(ExecutorService connectionExecutor) {
		Connection conn = null;
		ConnectionFactory cf = new ConnectionFactory();
		cf.setHost(RabbitMQ_Server);
		try {
			conn = cf.newConnection(connectionExecutor);
		} catch (IOException e) {
			System.out.println("IOException occurs while creating a connection.");
		} catch (TimeoutException e) {
			System.out.println("Timeout occurs while creating a connection.");
		}
		return conn;
	}

	private ExecutorService SetupExecutorService() {

		ThreadFactory threadFactory = new ThreadFactory() {
			int idx;

			@Override
			public Thread newThread(Runnable r) {
				Thread t = new Thread(r);
				t.setName("RMQ-" + (++idx));
				t.setDaemon(true);
				return t;
			}
		};

		ExecutorService connectionExecutor = Executors.newFixedThreadPool(ThreadPoolSize, threadFactory);
		return connectionExecutor;
	}

	public Channel CreateChannel() {
		Channel channel = null;
		try {
			channel = conn.createChannel();
			channel.queueDeclare(QUEUE_NAME, false, false, false, null);
		} catch (IOException e) {
			System.out.println("IOException occurs while creating channel.");
		}
		return channel;
	}

	public void Subscribe(Channel channel) {
		DeliverCallback deliverCallback = (consumerTag, delivery) -> {
			String message = new String(delivery.getBody(), "UTF-8");
			CallDetails[] callDetails = gson.fromJson(message, CallDetails[].class);
			System.out.println("Thread "+Thread.currentThread().getName()+" invoked, "+callDetails.length+" records inserted.");
			_repo.InsertList(callDetails);
		};

		try {
			channel.basicConsume(QUEUE_NAME, true, deliverCallback, consumerTag -> {});
		} catch (IOException e) {
			System.out.println("IOException occurs while subscribing to queue.");
		}
	}

}
