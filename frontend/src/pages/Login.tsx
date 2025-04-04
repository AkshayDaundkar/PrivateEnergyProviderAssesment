import AuthForm from "../components/AuthForm";
import DefaultLayout from "../layouts/DefaultLayout";

export default function Login() {
  return (
    <DefaultLayout>
      <AuthForm type="login" />
    </DefaultLayout>
  );
}
