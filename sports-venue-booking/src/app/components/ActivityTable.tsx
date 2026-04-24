import { getActivities } from "../data/ownerDummyData";

export default function ActivityTable() {
  const activities = getActivities();

  return (
    <section>
      <table className="w-full">
        <tbody>
          {activities.map(a => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.venue}</td>
              <td>{a.time}</td>
              <td>{a.amount}</td>
              <td>{a.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}