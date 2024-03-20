import { CardAction } from "@/components/CardActions";
import CurrentBalance from "@/components/CurrentBalance";
import { Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { MyLatestTransactions } from "./MyLastestTransactions";
import { Transaction } from "@/models/models.interfaces";
import Link from "next/link";


export async function getTransactions(bankAccountId: string): Promise<Transaction[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_NEST_API_URL}/bank-accounts/${bankAccountId}/transactions`,
    {
      next: {
        revalidate: 10,
        tags: [`bank-accounts/${bankAccountId}`],
      },
    }
  );
  return response.json()
}


export default async function BankAccountDashboardPage({
  params, searchParams
}: { params: { bankAccountId: string }, searchParams: {page: string, per_page: string} }) {

  const page = parseInt(searchParams.page) || 1;
  const per_page = parseInt(searchParams.per_page) || 1;
  const transactions = await getTransactions(params.bankAccountId)
  
  return (
    <Grid2 container spacing={3}>
      <Grid2 xs={12} lg={6}>
        <div>
          <CurrentBalance bankAccountId={params.bankAccountId} />
        </div>
      </Grid2>

      <Grid2 container xs={12} lg={6} spacing={2}>
        <Grid2 xs={6}>
          <Link
            href={`/bank-accounts/${params.bankAccountId}/withdraw`}
            style={{ textDecoration: "none" }}
          >
            <CardAction sx={{ display: "flex", alignItems: "center" }}>
              <Typography component="span" color={"primary"}>
                Transferência
              </Typography>
            </CardAction>
          </Link>
        </Grid2>

        <Grid2 xs={6}>
          <Link
            href={`/bank-accounts/${params.bankAccountId}/pix`}
            style={{ textDecoration: "none" }}
          >
            <CardAction sx={{ display: "flex", alignItems: "center" }}>
              <Typography component="span" color={"primary"}>
                Nova chave pix
              </Typography>
            </CardAction>
          </Link>
        </Grid2>
      </Grid2>

      <Grid2 xs={12}>
        <Typography variant="h5">Últimos lançamentos</Typography>
        <MyLatestTransactions transactions={transactions} />
      </Grid2>
    </Grid2>
  );
}