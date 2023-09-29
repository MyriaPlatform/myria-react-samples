import React, { useState, useEffect } from 'react';
import ChevronIcon from '../../icons/ChevronIcon';
import { IOptionsAsset, TOption } from '../../utils/utils';
import style from './style.module.css'

interface TProp {
  selectHandle: any;
  options: IOptionsAsset;
  className: string
  defaultSelectedOption?: TOption;
}

export default function CurrencySelector({
  selectHandle,
  options,
  defaultSelectedOption,
  className
}: TProp) {
  const [dropdownRef, setDropdownRef] = useState<HTMLDivElement | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(
    defaultSelectedOption || options.ETH,
  );
  const [isOpen, setIsOpen] = useState<Boolean>(false);


  useEffect(() => {
    const clickOutside = (event: MouseEvent) => {
      if (!dropdownRef || dropdownRef.contains(event.target as Node)) {
        return;
      }
      handleClose();
    };
    document.addEventListener('click', clickOutside);
    return () => {
      document.removeEventListener('click', clickOutside);
    };
  }, [dropdownRef]);

  const selectItem = (item: any) => {
    setSelectedItem(item);
    selectHandle(item);
    handleClose();
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const toggleDropDown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div ref={setDropdownRef} className={className}>
      <div className="position-relative">
        <div
          onClick={() => {
            toggleDropDown();
          }}
          className={`${style.selectContainer} position-relative d-flex cursor-pointer align-items-center justify-content-between px-4 py-2 ${
            !isOpen ? 'rounded-lg' : style.borderBorderTop
          }`}
        >
          <div>
            {!isOpen ? (
              <div>
                {selectedItem ? (
                  <div className="d-flex align-items-center">
                    <img
                      className={style.selectIcon}
                      src={selectedItem.ico}
                      alt="currency_avatar"
                    />
                    <span className={`me-2 text-base-10 ${style.selectedName}`}>
                      {selectedItem.name}
                    </span>
                    <div className={`${style.selectedShort} d-flex align-items-center justify-content-center px-2 py-1`}>
                      {selectedItem.short}
                    </div>
                  </div>
                ) : (
                  'Select Currency'
                )}
              </div>
            ) : (
              <span className={style.selectAsset}>Select an asset</span>
            )}
          </div>
          <button aria-label="toggle menu" style={{width: 'calc(100% - 20px'}} className='position-absolute bg-transparent border-none'>
            <div className='d-flex justify-content-end'>
            <ChevronIcon />
            </div>
          </button>
        </div>
        {isOpen && (
          <ul className={`bg-base-4 position-absolute ${style.listItemSelect} pb-3`}>
            {Object.keys(options).map((item: string, index: number) => (
              <div
                key={`${index}${JSON.stringify(item)}`}
                className="cursor-pointer pe-4 ps-2"
                onClick={() => {
                  selectItem(options[item]);
                }}
              >
                <li className={`${style.itemSelect} py-2 ps-3`}>
                  <div>
                    <div className="d-flex align-items-center">
                      <img
                        className={style.selectIcon}
                        src={options[item].ico}
                        alt="currency_avatar_2"
                      />
                      <span className={`me-2 text-base-10 ${style.selectedName}`}>
                        {options[item].name}
                      </span>
                      <div className={`${style.selectedShort} d-flex align-items-center justify-content-center px-2 py-1`}>
                        {selectedItem.short}
                      </div>
                    </div>
                  </div>
                </li>
              </div>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
