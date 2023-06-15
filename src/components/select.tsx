import React from "react";
import Fuse from "fuse.js";
import AsyncSelect from "react-select/async";
import { FixedSizeList as List } from "react-window";

type Select_t = {
  value: Number;
  label: String;
};

const OPTION_HEIGHT = 40;
const ROWS = 6;

const MenuList = ({ options, children, getValue, width }: any) => {
  const [value] = getValue();
  const initialOffset =
    options.indexOf(value) !== -1
      ? Array.isArray(children) && children.length >= ROWS
        ? options.indexOf(value) >= ROWS
          ? options.indexOf(value) * OPTION_HEIGHT - OPTION_HEIGHT * 5
          : 0
        : 0
      : 0;

  return Array.isArray(children) ? (
    <List
      height={
        children.length >= ROWS
          ? OPTION_HEIGHT * ROWS
          : children.length * OPTION_HEIGHT
      }
      width={width}
      itemCount={children.length}
      itemSize={OPTION_HEIGHT}
      initialScrollOffset={initialOffset}
    >
      {({ style, index }) => {
        return <div style={style}>{children[index]}</div>;
      }}
    </List>
  ) : (
    <div>{children}</div>
  );
};

export default function Select_large(props: any) {
  const myIndex = Fuse.createIndex(["label"], props.options);

  const fuse = new Fuse(
    props.options,
    {
      keys: ["label"],
      threshold: 0.3,
    },
    myIndex
  );

  return (
    <AsyncSelect
      {...props}
      filterOption={false}
      components={{ MenuList }}
      defaultOptions={props.options}
      loadOptions={(value: any): Promise<any> => {
        return new Promise((resolve) => {
          const filter = fuse.search(value);
          if (!value.length) {
            resolve(props.options);
          } else {
            if (filter.length == 0) {
              resolve([]);
            } else {
              const result: Array<Select_t> = filter.map((e: any) => {
                return {
                  label: String(e.item.label),
                  value: Number(e.item.value),
                };
              });
              resolve(result);
            }
          }
        });
      }}
    />
  );
}
