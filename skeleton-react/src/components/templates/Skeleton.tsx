import { CssBaseline } from "@mui/material";
import Header from "components/templates/layout/Header";

export default function Skeleton(props: any) {
  return (
    <div>
      <CssBaseline />
      <Header
      />
      {/* <MenuSlider open={open} user={user} refreshUser={refreshUser} /> */}
    </div>
  );
}
