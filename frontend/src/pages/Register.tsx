import AuthForm from "../components/AuthForm";
import DefaultLayout from "../layouts/DefaultLayout";

export default function Register() {
  return (
    <DefaultLayout>
      <AuthForm type="register" />
    </DefaultLayout>
  );
}
