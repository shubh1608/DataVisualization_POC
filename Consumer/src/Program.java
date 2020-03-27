import com.rabbitmq.client.*;

public class Program {
	
	public static void main(String[] args) {
		
		Queue queue = new Queue();
		
		Channel c1 = queue.CreateChannel();
		queue.Subscribe(c1);
		
		Channel c2 = queue.CreateChannel();
		queue.Subscribe(c2);
	}
	
}
