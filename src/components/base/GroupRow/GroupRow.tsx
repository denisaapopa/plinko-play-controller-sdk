import cx from "classnames";
import { ComponentProps } from "react";

import styles from "./GroupRow.module.scss";

export type Props = ComponentProps<"div"> & {
  label?: string;
  classNames?: string;
};

const GroupRow = ({ children, label, classNames, ...restProps }: Props) => {
  return (
    <div {...restProps} className={cx(styles.base, classNames)}>
      {label && <div className={styles.label}>{label}</div>}
      <div className={styles.group}>{children}</div>
    </div>
  );
};

export default GroupRow;
