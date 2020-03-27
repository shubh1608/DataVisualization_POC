public class CallDetailsRepository {
	
	public void Insert(String msg) {
		String threadName = Thread.currentThread().getName();
		System.out.println("Inserted by: "+threadName+" -> "+ msg);
	}
	
}
