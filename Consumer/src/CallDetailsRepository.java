import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import com.datastax.driver.core.Session;

public class CallDetailsRepository {

	private Session _session;

	public CallDetailsRepository(Session session) {

		try {
			this._session = session;
			final String createMovieCql = "CREATE TABLE IF NOT EXISTS CallDetailsSpace.CallDetails "
					+ "(callid int, hostid int, src varchar, dest varchar, mos double, year int, month int, day int, hour int, PRIMARY KEY (callid, hostid, year, month, day, hour))";
			_session.execute(createMovieCql);
		} catch (Exception e) {
			System.out.println("Something went wrong while creating CallDetails table.");
			throw e;
		}

	}

	public void Insert(CallDetails details) {
		try {
			Calendar cal = FormatDate(details.created);
			int year = cal.get(Calendar.YEAR);
			int month = cal.get(Calendar.MONTH) + 1;
			int day = cal.get(Calendar.DAY_OF_MONTH);
			int hour = cal.get(Calendar.HOUR_OF_DAY);
			_session.execute(
					"INSERT INTO CallDetailsSpace.CallDetails (callid, hostid, src, dest, mos, year, month, day, hour) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
					details.callid, details.hostid, details.src, details.dest, details.mos, year, month, day, hour);
		} catch (Exception e) {
			System.out.println("Something went wrong while inserting record to database.");
			throw e;
		}
	}

	public void InsertList(CallDetails[] callDetails) {
		for (CallDetails details : callDetails) {
			Insert(details);
		}
	}

	private Calendar FormatDate(String strDate) {
		DateFormat format = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss", Locale.ENGLISH);
		Calendar calendar = Calendar.getInstance();
		Date date;
		try {
			date = format.parse(strDate);
			calendar.setTime(date);
		} catch (ParseException e) {
			System.out.println("Something went wrong while parsing date.");
		}
		return calendar;
	}
}
