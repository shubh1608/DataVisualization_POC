
public class Consumer {

	public static void main(String[] args) {
		
		Receive rec = new Receive();
		try {
			rec.read();
		} catch (Exception e) {
			System.out.println("something went wrong.");
		}
		System.out.println("successfull read data from queue.");
	}

}
