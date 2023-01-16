import { transform } from "typescript";
import { useRouter } from "next/router";
import { CategoriesDB } from "../utils/database.categories";
import { PlacesDB } from "../utils/database.places";
import { useEffect, useState, useRef } from "react";
import { supabase } from "../supabase";
import Image from "next/image";
import loader from "../public/loader.gif";
import spinner from "../public/spinner.png";
import { InferGetStaticPropsType } from "next";

type Categories = CategoriesDB["public"]["Tables"]["categories"]["Row"];
type Places = PlacesDB["public"]["Tables"]["places"]["Insert"];

export default function Posts({
  categories,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [loadingButton, setLoadingButton] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const [valid, setValid] = useState(false);

  const fileRef = useRef(null);

  const [formData, setFormData] = useState<Places>({
    name: "",
    description: "",
    instagram: "",
    website: "",
    thumbnail: "",
    map: "",
    category_uuid: "",
  });

  const router = useRouter();
  // const isValid = Object.values(formData).every((value) => value!.length > 0);

  const onChangeInput = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handlePlacePost = async () => {
    try {
      setLoadingButton(true);
      let { data, error, status } = await supabase
        .from("places")
        .insert(formData);

      if (error && status !== 406) {
        throw error;
      }
      setSuccess(true);
    } catch (error) {
      setError(true);
      setSuccess(false);
      console.log(error);
    } finally {
      setLoadingButton(false);
      setFormData({
        name: "",
        description: "",
        instagram: "",
        website: "",
        thumbnail: "",
        map: "",
        category_uuid: "",
      });

      // @ts-ignore: Object is possibly 'null'.
      fileRef.current.value = null;
      window.scrollTo(0, 0);
    }
  };

  const uploadFile = async (event: any) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${(Math.random() + 1)
        .toString(36)
        .substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      let { data, error: uploadError } = await supabase.storage
        .from("places-bucket")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.log(uploadError);

        throw uploadError;
      }

      const { name, value } = event.target;
      setFormData({ ...formData, [name]: value });
    } catch (error) {
      alert("Error uploading file!");
      console.log(error);
    } finally {
    }
  };

  useEffect(() => {
    const validate: Boolean[] = [];
    const requiredField = ["name", "description", "category_uuid", "thumbnail"];
    Object.entries(formData).forEach(([key, item]) => {
      if (requiredField.includes(key)) validate.push(!!(item && item.length));
    });
    setValid(!validate.includes(false));
  }, [formData]);
  return (
    <div className="bg-gray-50">
      <div
        style={{
          backgroundImage: `url('/wave.png')`,
          height: "250px",
          // width: "100%",
          backgroundSize: "cover",
        }}
      ></div>
      <div>
        <div className="px-4 pb-4 flex flex-col items-center min-h-screen pt-6 sm:justify-center sm:pt-0 bg-gray-50">
          <div>
            <h3 className="text-4xl font-bold text-sky-500">
              Isi data tempat favoritmu
            </h3>
          </div>
          <div className="w-full px-6 py-4 mt-6 overflow-hidden bg-white shadow-md sm:max-w-lg sm:rounded-lg">
            {success ? (
              <div
                className="p-4 mt-3 mb-3 text-sm text-green-700 bg-green-100 rounded-lg "
                role="alert"
              >
                <span className="font-medium ">
                  Berhasil Menambah Data baru!.
                </span>{" "}
                Terima kasih sudah berkontribusi :), Data mu akan direview sama
                mimin terlebih dahulu
              </div>
            ) : (
              ""
            )}
            {error ? (
              <div
                className="p-4 mt-3 mb-3 text-sm text-red-700 bg-red-100 rounded-lg "
                role="alert"
              >
                <span className="font-medium ">Gagal Menambah Data baru!.</span>{" "}
                Duhh, servernya lagi bermasalah nih! :(
              </div>
            ) : (
              ""
            )}
            <form>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 undefined"
                >
                  Nama tempat favoritmu &#128513;
                </label>
                <div className="flex flex-col items-start">
                  <input
                    type="text"
                    name="name"
                    className="block p-2.5 w-full text-sm text-gray-900 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-sky-500 "
                    placeholder="Coffeshop kekinian"
                    value={formData.name || ""}
                    onChange={onChangeInput}
                  />
                </div>
              </div>
              <div className="mt-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 undefined"
                >
                  Kategori tempat favoritmu &#128535;
                </label>
                <div className="flex flex-col items-start">
                  <select
                    id="favColor"
                    className="block p-2.5 w-full text-sm text-gray-900 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-sky-500 "
                    onChange={onChangeInput}
                    name="category_uuid"
                  >
                    {categories?.map((category) => (
                      <option key={category.uuid} value={category.uuid}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 undefined"
                >
                  Deskripsiin tempat favoritmu &#128513;
                </label>
                <div className="flex flex-col items-start">
                  <textarea
                    name="description"
                    className="block p-2.5 w-full text-sm text-gray-900 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-sky-500 "
                    placeholder="Salah satu coffeshop terbaik di medan..."
                    onChange={onChangeInput}
                    value={formData.description || ""}
                  ></textarea>
                </div>
              </div>
              <div className="mt-4">
                <label
                  htmlFor="instagram"
                  className="block text-sm font-medium text-gray-700 undefined"
                >
                  Instagram (Boleh kosong, tapi jangan dikosongin &#128546;)
                </label>
                <div className="flex flex-col items-start">
                  <input
                    type="text"
                    name="instagram"
                    className="block p-2.5 w-full text-sm text-gray-900 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-sky-500 "
                    placeholder="Username instagram tanpa menggunakan '@' (bayskiee, jokiinaja.id)"
                    onChange={onChangeInput}
                    value={formData.instagram || ""}
                  />
                </div>
              </div>
              <div className="mt-4">
                <label
                  htmlFor="website"
                  className="block text-sm font-medium text-gray-700 undefined"
                >
                  Website (Boleh kosong, tapi jangan dikosongin &#128546;)
                </label>
                <div className="flex flex-col items-start">
                  <input
                    type="text"
                    name="website"
                    className="block p-2.5 w-full text-sm text-gray-900 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-sky-500 "
                    placeholder="youtube.com, facebook.com, etc"
                    onChange={onChangeInput}
                    value={formData.website || ""}
                  />
                </div>
              </div>
              <div className="mt-4">
                <label
                  htmlFor="map"
                  className="block text-sm font-medium text-gray-700 undefined"
                >
                  Google Map (Boleh kosong, tapi jangan dikosongin &#128546; )
                </label>
                <div className="flex flex-col items-start">
                  <input
                    type="text"
                    name="map"
                    className="block p-2.5 w-full text-sm text-gray-900 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-sky-500 "
                    placeholder="https://goo.gl/maps/M7nY9Fs33W4B6THPA"
                    onChange={onChangeInput}
                    value={formData.map || ""}
                  />
                </div>
              </div>
              <div className="mt-4">
                <label
                  htmlFor="thumbnail"
                  className="block text-sm font-medium text-gray-700 undefined"
                >
                  Thumbnailnya (Harus diisi, biar keren &#128526;)
                </label>
                <div className="flex flex-col items-start">
                  <input
                    type="file"
                    name="thumbnail"
                    className="block p-2.5 w-full text-sm text-gray-900 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-sky-500 "
                    onChange={uploadFile}
                    ref={fileRef}
                  />
                </div>
              </div>
              <div className="flex items-center mt-4">
                {loadingButton ? (
                  <button
                    type="button"
                    className="items-center w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-sky-500 rounded-md hover:bg-sky-500 focus:outline-none focus:bg-sky-500 ease-linear transition-all duration-150 flex justify-center"
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
                    className={`w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform ${
                      !valid ? "bg-sky-500" : "bg-emerald-400 "
                    }  rounded-md  focus:outline-none `}
                    type="button"
                    onClick={() => handlePlacePost()}
                    disabled={!valid}
                  >
                    {!valid ? "Lengkapi dulu formnya " : "Kirim datanya"}
                  </button>
                )}
              </div>
            </form>
            <button
              aria-label="Login with GitHub"
              role="button"
              className="mt-5 w-full px-4 py-2 tracking-wide text-black transition-colors duration-200 transform  rounded-md hover:text-sky-500 focus:outline-none focus:text-sky-500"
              onClick={() => router.push("/")}
            >
              <p>Kembali ke halaman utama</p>
            </button>
          </div>
        </div>
      </div>
    </div>
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
