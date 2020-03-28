import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;

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

		} catch (Exception e) {
			client.close();
			System.out.println("Stopping application.");
		}

	}
	
	private static void test() throws Exception
	{
		String string = "2020-03-28 21:05:10";
		DateFormat format = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss", Locale.ENGLISH);
		Calendar calendar = Calendar.getInstance();
		Date date = format.parse(string);
		calendar.setTime(date);
		System.out.println(calendar.get(Calendar.YEAR)); 
		System.out.println(calendar.get(Calendar.MONTH)+1); 
		System.out.println(calendar.get(Calendar.DAY_OF_MONTH)); 
		System.out.println(calendar.get(Calendar.HOUR_OF_DAY)); 
	}

}
