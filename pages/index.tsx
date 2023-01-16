import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { PlacesDB } from "../utils/database.places";
import loader from "../public/loader.gif";
import spinner from "../public/spinner.png";
import { InferGetStaticPropsType } from "next";

type Places = PlacesDB["public"]["Tables"]["places"]["Row"];

export default function Home({
  categories,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [places, setPlace] = useState<Places[] | null>([]);
  // const [categories, setCategory] = useState<Categories[] | null>([]);
  const [active, setActive] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const [comment, setComment] = useState("");
  const [loadingButton, setLoadingButton] = useState(false);
  const [success, setSuccess] = useState(false);

  const [loading, setLoading] = useState(true);
  const [filterLoad, setFilterLoad] = useState(false);
  const [valid, setValid] = useState(false);

  const color = [
    "text-blue-800",
    "text-gray-800",
    "text-red-800",
    "text-green-800",
    "text-yellow-800",
    "text-indigo-800",
    "text-purple-800",
    "text-orange-800",
    "text-pink-800",
  ];

  const colorBG = [
    "bg-slate-300",
    "bg-blue-100",
    "bg-gray-100",
    "bg-red-100",
    "bg-green-100",
    "bg-yellow-100",
    "bg-indigo-100",
    "bg-purple-100",
    "bg-orange-100",
    "bg-pink-100",
  ];
  async function fetchPlace(categoryUuid: string) {
    try {
      setLoading(true);
      let { data, error, status } =
        categoryUuid === "all"
          ? await supabase
              .from("places")
              .select(`*,category:categories (*)`)
              .is("published", true)
          : await supabase
              .from("places")
              .select(`*,category:categories (*)`)
              .is("published", true)
              .eq("category_uuid", categoryUuid);

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setPlace(data);
      }
    } catch (error) {
      alert("Error fetch categories data!");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const truncate = (str: string, max: number, len: number) => {
    return str.length > max ? str.substring(0, len) + "..." : str;
  };

  const activeFunction = async (index: number, uuid: string) => {
    setActive(index);
    setFilterLoad(true);
    await fetchPlace(uuid);
    setFilterLoad(false);
  };
  const handleChangeComment = (event: any) => {
    setComment(event.target.value);
    setValid(comment.length > 0 ? true : false);
  };
  const handleComment = async () => {
    try {
      setLoadingButton(true);
      let { data, error, status } = await supabase
        .from("comments")
        .insert({ comment: comment });

      if (error && status !== 406) {
        throw error;
      }
      setSuccess(true);
    } catch (error) {
      alert("Error add comment!");
      console.log(error);
    } finally {
      setLoadingButton(false);
      setComment("");
    }
  };
  const handleCloseModal = () => {
    setSuccess(false);
    setShowModal(false);
  };

  useEffect(() => {
    fetchPlace("all");
  }, []);

  useEffect(() => {
    setValid(comment.length > 0 ? true : false);
  }, [comment]);
  if (loading && !filterLoad)
    return (
      <div className="grid h-screen place-items-center">
        <Image src={loader} alt="loading..." />
      </div>
    );
  return (
    <>
      <div
        style={{
          backgroundImage: `url('/wave.png')`,
          height: "250px",
          // width: "100%",
          backgroundSize: "cover",
        }}
        className="w-content"
      ></div>
      <div className="container mx-auto px-4 pb-4">
        <div className="m-auto w-8/12 ">
          <p className="text-center font-sans font-serif text-6xl underline mb-2">
            MEDAN Walk
          </p>
          <p className="text-center font-sans font-serif text-2xl">
            Banyak hal positif di Medan, mari saling mengenal
          </p>
          <p className="text-center mt-5 font-sans font-serif text-lg">
            Kumpulan hal positif yang ada di Medan. Cari cafe atau coworking
            tempat untuk kamu bekerja, komunitas untuk mengisi waktu luang atau
            mengembangkan bakat, sampai usaha-usaha startup asli dari Medan.
            MEDAN Walk bukan media, bukan startup, hanya berbagi informasi, yang
            dibuat oleh programmer iseng. Kamu bisa memberi kritik atau saran{" "}
            <a
              className="text-sky-400"
              href="#"
              onClick={() => setShowModal(true)}
            >
              disini
            </a>{" "}
            atau tambahkan data baru{" "}
            <Link className="text-sky-400" href={"/posts"}>
              disini
            </Link>
            . Kalau menurut kamu ini menarik, silahkan share linknya{" "}
            <a className="text-sky-400" href="https://bit.ly/mdnwalk">
              bit.ly/mdnwalk
            </a>
          </p>
        </div>

        <div className="m-auto text-center py-10">
          <span
            onClick={() => activeFunction(0, "all")}
            className={`${
              active === 0 ? colorBG[active] : ""
            } text-slate-800 text-lg font-medium mr-2 px-2.5 py-0.5 rounded-full cursor-pointer  transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300`}
          >
            All
          </span>
          {categories?.map((category: any, index: number) => (
            <span
              onClick={() => activeFunction(index + 1, category.uuid)}
              key={category.uuid}
              className={`${color[index]} ${
                index + 1 === active ? colorBG[index + 1] : ""
              } text-lg font-medium mr-2 px-2.5 py-0.5 rounded-full m-2 cursor-pointer transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300`}
            >
              {category.name}
            </span>
          ))}
        </div>

        {filterLoad ? (
          <div className="grid place-items-center">
            <Image src={loader} alt="loading..." />
          </div>
        ) : (
          <div className="grid grid-flow-row gap-4  sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {places?.map((place) => (
              <div
                className=" rounded overflow-hidden shadow-lg transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 duration-150"
                key={place.uuid}
              >
                <div className="w-full">
                  <Image
                    className="w-full h-fit"
                    src={place.thumbnail || ""}
                    alt="Sunset in the mountains"
                    width="0"
                    height="0"
                    sizes="100vw"
                  />
                </div>
                <div className="px-6 py-4">
                  <div className="font-bold text-xl mb-2">{place.name}</div>
                  <p className="text-gray-700 text-base">
                    {truncate(place.description || "", 100, 100)}
                  </p>
                </div>
                <div className="px-6 pt-4 pb-2">
                  {place.instagram ? (
                    <div className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                      <a
                        href={
                          `https://www.instagram.com/${place.instagram}` || "#"
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-5 h-5 inline"
                        >
                          <path d="M12 9a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 9z" />
                          <path
                            fillRule="evenodd"
                            d="M9.344 3.071a49.52 49.52 0 015.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 01-3 3h-15a3 3 0 01-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 001.11-.71l.822-1.315a2.942 2.942 0 012.332-1.39zM6.75 12.75a5.25 5.25 0 1110.5 0 5.25 5.25 0 01-10.5 0zm12-1.5a.75.75 0 100-1.5.75.75 0 000 1.5z"
                            clipRule="evenodd"
                          />
                        </svg>

                        <span> Instagram</span>
                      </a>
                    </div>
                  ) : (
                    ""
                  )}

                  {place.website ? (
                    <div className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                      <a href={place.website || "#"}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-5 h-5 inline"
                        >
                          <path d="M15.75 8.25a.75.75 0 01.75.75c0 1.12-.492 2.126-1.27 2.812a.75.75 0 11-.992-1.124A2.243 2.243 0 0015 9a.75.75 0 01.75-.75z" />
                          <path
                            fillRule="evenodd"
                            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM4.575 15.6a8.25 8.25 0 009.348 4.425 1.966 1.966 0 00-1.84-1.275.983.983 0 01-.97-.822l-.073-.437c-.094-.565.25-1.11.8-1.267l.99-.282c.427-.123.783-.418.982-.816l.036-.073a1.453 1.453 0 012.328-.377L16.5 15h.628a2.25 2.25 0 011.983 1.186 8.25 8.25 0 00-6.345-12.4c.044.262.18.503.389.676l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.575 15.6z"
                            clipRule="evenodd"
                          />
                        </svg>

                        <span> Web</span>
                      </a>
                    </div>
                  ) : (
                    ""
                  )}

                  {place.map ? (
                    <div className="  inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                      <a href={place.map || "#"}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-5 h-5 inline"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.161 2.58a1.875 1.875 0 011.678 0l4.993 2.498c.106.052.23.052.336 0l3.869-1.935A1.875 1.875 0 0121.75 4.82v12.485c0 .71-.401 1.36-1.037 1.677l-4.875 2.437a1.875 1.875 0 01-1.676 0l-4.994-2.497a.375.375 0 00-.336 0l-3.868 1.935A1.875 1.875 0 012.25 19.18V6.695c0-.71.401-1.36 1.036-1.677l4.875-2.437zM9 6a.75.75 0 01.75.75V15a.75.75 0 01-1.5 0V6.75A.75.75 0 019 6zm6.75 3a.75.75 0 00-1.5 0v8.25a.75.75 0 001.5 0V9z"
                            clipRule="evenodd"
                          />
                        </svg>

                        <span> Maps</span>
                      </a>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal ? (
          <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div className="relative w-auto my-6 mx-auto max-w-3xl">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  {/*header*/}
                  <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                    <h3 className="text-3xl font-semibold ">Komentar</h3>
                    <button
                      className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                      onClick={() => setShowModal(false)}
                    >
                      <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                        ×
                      </span>
                    </button>
                  </div>
                  {/*body*/}
                  {success ? (
                    <div
                      className="p-4 mx-3 mt-3 text-sm text-green-700 bg-green-100 rounded-lg "
                      role="alert"
                    >
                      <span className="font-medium ">
                        Berhasil Menambah Komentar!.
                      </span>{" "}
                      Terima kasih sudah berkomentar :)
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="relative p-6 flex-auto w-100">
                    <label className="block mb-2 text-sm font-medium text-gray-900 ">
                      Tulis disini komentarmu
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      cols={60}
                      className="block p-2.5 w-full text-sm text-gray-900 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 "
                      placeholder="Write your thoughts here..."
                      value={comment}
                      onChange={handleChangeComment}
                    ></textarea>
                  </div>
                  {/*footer*/}
                  <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                    <button
                      className="text-gray-500 background-transparent font-bold  px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => handleCloseModal()}
                      data-bs-dismiss="modal"
                    >
                      Tutup
                    </button>
                    {loadingButton ? (
                      <button
                        type="button"
                        className="bg-sky-500 text-white active:bg-sky-600 font-bold  text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 flex"
                        disabled
                      >
                        <Image
                          alt="spinner"
                          src={spinner}
                          className="animate-spin h-5 w-5 mr-3 ..."
                        />
                        Processing...
                      </button>
                    ) : (
                      <button
                        className={`${
                          !valid ? "bg-sky-500" : "bg-emerald-400"
                        } text-white active:bg-sky-600 font-bold  text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150`}
                        type="button"
                        onClick={() => handleComment()}
                        disabled={!valid}
                      >
                        {!valid ? "Isi dulu komennya " : "Kirim komennya"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}
      </div>
    </>
  );
}

export async function getStaticProps() {
  try {
    let { data, error, status } = await supabase.from("categories").select("*");

    if (error && status !== 406) {
      throw error;
    }
    return {
      props: {
        categories: data,
      },
    };
  } catch (error) {
    alert("Error fetch categories data!");
    console.log(error);
  }
}
