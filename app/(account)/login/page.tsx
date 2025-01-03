"use client";
import Container from "@//components/common/Container";
import Header from "@//components/common/Header";
import InputBox from "@//components/common/InputBox";
import { Input } from "@//components/ui";
import { Button } from "@//components/ui/Button";
import { useAlertStore } from "@//context/useAlertStore";
import { login } from "@/api/auth";
import { useUserStore } from "@/context/useUserStore";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Cookies } from "react-cookie";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
export default function Page() {
  const cookies = new Cookies();
  const router = useRouter();
  const { openAlert, closeAlert } = useAlertStore();
  const {
    reset,
    register,
    resetField,
    formState: { dirtyFields, errors, isValid, isDirty },
    handleSubmit,
  } = useForm<z.infer<typeof loginSchema>>({
    mode: "onChange",
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleOnSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      const response = await login({
        email: data.email,
        password: data.password,
      });
      const result = await response.json();

      if (response.ok) {
        useUserStore.setState({
          id: result.user.id,
          email: result.user.email,
        });
        cookies.set("userToken", result.token);

        router.replace("/");
      } else {
        openAlert({
          title: result.message,
          desc: result.message,
          isCancel: false,
          confirmAction: () => {
            closeAlert();
            reset();
          },
        });
      }
    } catch (error) {
      console.error("Error:", error);
      openAlert({
        title: "시스템 에러",
        desc: "예기치 않은 문제가 발생했습니다. 다시 시도해주세요.",
        isCancel: false,
        confirmAction: () => {
          closeAlert();
          reset();
        },
      });
    }
  };
  return (
    <Container>
      <Header title="로그인" isTitle={false} isBack={false} />
      <h2 className="flex flex-col text-center justify-center py-12 gap-1">
        <strong className="font-bold text-3xl tracking-tighter italic">
          KREAM
        </strong>
        <span className="text-xs tracking-tighter">
          KICKS RULE EVERYTHING AROUND ME
        </span>
      </h2>
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <div className="flex flex-col gap-4 px-5">
          <InputBox
            required
            name="email"
            label="이메일 주소"
            placeholder="이메일 주소"
            input={
              <Input
                {...register("email", { required: true })}
                errors={errors.email}
                resetField={resetField}
                dirtyFields={dirtyFields.email}
                type="email"
                name="email"
                id="email"
                placeholder="이메일 주소"
              />
            }
          />
          <InputBox
            required
            name="password"
            label="비밀번호"
            placeholder=""
            input={
              <Input
                {...register("password", { required: true })}
                errors={errors.password}
                resetField={resetField}
                dirtyFields={dirtyFields.password}
                type="password"
                name="password"
                id="password"
                placeholder=""
              />
            }
          />
          <Button
            type="submit"
            color="primary"
            size="full"
            disabled={!isDirty || !isValid}
          >
            로그인
          </Button>
        </div>
      </form>
      <ul className="grid grid-cols-3 px-5 text-xs py-10">
        <li className="text-center">
          <Link href="/signup">이메일 가입</Link>
        </li>
        <li className="text-center relative before:absolute before:content-[''] before:w-[1px] before:h-[10px] before:bg-gray-200 before:top-1/2 before:-translate-y-1/2 before:left-0">
          <Link href="/find-email">이메일 찾기</Link>
        </li>
        <li className="text-center relative before:absolute before:content-[''] before:w-[1px] before:h-[10px] before:bg-gray-200 before:top-1/2 before:-translate-y-1/2 before:left-0">
          <Link href="/find-pass">비밀번호 찾기</Link>
        </li>
      </ul>
    </Container>
  );
}
