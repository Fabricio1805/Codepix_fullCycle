import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry";
import Box from "@mui/material/Box";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Codepix",
  description: "codepix description",
};

export default function RootLayout(props:  { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          {/*<Navbar />*/}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              mx: ['16px', '120px'],
              my: ['80px', '120px']
            }}
          >
            {props.children}
          </Box>
        </ThemeRegistry>
      </body>
    </html>
  );
}
