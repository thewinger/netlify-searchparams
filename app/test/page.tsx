type Props = {
  searchParams: { [key: string]: string | string[] };
};

export default function PropiedadesPage({ searchParams }: Props) {
  return <div>{JSON.stringify(searchParams)}</div>;
}
