import React from "react";
import Image from "next/image";
import Link from "next/link";
import { AiTwotoneCalendar } from "react-icons/ai";
import moment from "moment";

const OtherBlogs = ({ otherBlogs,demoImage }) => {
  const timeStr = otherBlogs?.createdAt;
  const time = moment(timeStr);
  const formattedTime = time.format("MMMM Do YYYY");

  // console.log("otherBlogs",otherBlogs)

  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {otherBlogs?.length > 0 &&
          otherBlogs?.map((item, index) => (
            <div key={index}>
              <Link href={`/blog/${item?._id}`}>
                <div>
                  <Image
                    src={item.image?.url}
                    alt="blog image"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-full h-full rounded-lg mb-2"
                  />

                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-xs">
                      <p className="text-primaryColor">{item?.category}</p>

                      <p className="flex items-center gap-1 text-paragraphColor">
                        <AiTwotoneCalendar />
                        {formattedTime}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h2>{item?.title}</h2>
                      <p className="text-sm text-paragraphColor">
                        {item?.excerpt}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Image
                                        src={item?.authorId?.avatar ? item?.authorId?.avatar : demoImage}

                        alt="picture of the author"
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="w-10 h-10 rounded-full"
                      />

                      <div className="text-xs">
                        <h6>{item?.authorId?.name}</h6>
                        <p className="text-paragraphColor">
                          {item?.authorId?.designation}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
      </div>
    </section>
  );
};

export default OtherBlogs;
