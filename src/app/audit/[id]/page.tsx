import { supabase } from "@/lib/supabase";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AuditPage({ params }: Props) {
  const { id } = await params;

  const { data } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .single();

  if (!data) {
    return <div className="p-10 text-center text-2xl">Audit not found</div>;
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="bg-white max-w-3xl w-full rounded-2xl shadow-lg p-6">
        <h1 className="text-4xl font-bold mb-6">AI Spend Audit Report</h1>

        <div className="bg-black text-white p-5 rounded-xl mb-6">
          <h2 className="text-2xl font-bold mb-2">Potential Savings</h2>

          <p className="text-4xl font-bold">${data.savings}/month</p>

          <p className="text-lg text-gray-300">${data.savings * 12}/year</p>
        </div>

        <div className="space-y-4">
          {data.audit_results.map((item: any, index: number) => (
            <div key={index} className="bg-gray-100 p-5 rounded-xl">
              <div className="flex justify-between mb-2">
                <h3 className="text-xl font-bold">{item.tool}</h3>

                <span className="text-green-600 font-bold">
                  ${item.savings}/mo
                </span>
              </div>

              <p>{item.message}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 border rounded-xl p-5">
          <h2 className="text-2xl font-bold mb-3">AI Summary</h2>

          <p className="text-gray-700 leading-7">{data.summary}</p>
        </div>
      </div>
    </main>
  );
}
