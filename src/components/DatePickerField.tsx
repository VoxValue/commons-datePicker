import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { dateStringToDate, dateToIso } from "../libs/date";
import { DatePickerProps, DateValueType } from "../types";

import Datepicker from "./Datepicker";

const DatePicker = ({
    name,
    defaultValue,
    required = true,
    min,
    max,
    testIdPrefix = "core-datepicker-",
    ariaLabelId,
    errorId,
    onChange
}: DatePickerProps) => {
    const hiddenInputRef = useRef<HTMLInputElement>(null);

    const initialDate = defaultValue ? dateStringToDate(defaultValue) : null;
    const [pickerValue, setPickerValue] = useState<DateValueType>(
        initialDate ? { startDate: initialDate, endDate: initialDate } : null
    );
    const [inputValue, setInputValue] = useState(defaultValue ?? "");
    const [errorActive, setErrorActive] = useState(false);
    const [touched, setTouched] = useState(false);

    const errorDescId = useMemo(() => `${name}-error`, [name]);
    const minIso = useMemo(() => (min ? dateToIso(min) : undefined), [min]);
    const maxIso = useMemo(() => (max ? dateToIso(max) : undefined), [max]);

    const handlePickerChange = useCallback(
        (value: DateValueType) => {
            const date = value?.startDate;
            const iso = date instanceof Date ? dateToIso(date) : "";
            setInputValue(iso);
            setPickerValue(value);
            setTouched(true);
            onChange?.(iso);
        },
        [onChange]
    );

    const handleInvalid = useCallback((event: React.InvalidEvent<HTMLInputElement>) => {
        event.preventDefault();
        setTouched(true);
        setErrorActive(true);
    }, []);

    // Re-check validity after inputValue or range constraints change.
    useEffect(() => {
        if (touched && hiddenInputRef.current) {
            setErrorActive(!hiddenInputRef.current.validity.valid);
        }
    }, [inputValue, min, max, touched]);

    // Propagate error state to the visible Datepicker input via inputClassName.
    const inputClassName = useMemo(
        () => (errorActive ? (base: string) => `${base} border-red-500 ring-red-500` : null),
        [errorActive]
    );

    return (
        <div>
            {/* Hidden date input — participates in FormData and browser constraint validation. */}
            <input
                ref={hiddenInputRef}
                type="date"
                id={name}
                name={name}
                value={inputValue}
                required={required}
                min={minIso}
                max={maxIso}
                aria-invalid={errorActive}
                aria-describedby={errorDescId}
                aria-label={ariaLabelId}
                data-testid={`${testIdPrefix}${name}`}
                className="sr-only"
                tabIndex={-1}
                onChange={() => {}}
                onInvalid={handleInvalid}
            />

            <Datepicker
                asSingle
                useRange={false}
                value={pickerValue}
                onChange={handlePickerChange}
                minDate={min}
                maxDate={max}
                required={required}
                inputId={`${name}-display`}
                inputClassName={inputClassName}
            />

            {errorActive && (
                <p
                    id={errorDescId}
                    className="mt-2 text-sm text-red-600"
                    data-testid={`${testIdPrefix}${name}-error-message`}
                    role="alert"
                >
                    {errorId ?? ""}
                </p>
            )}
        </div>
    );
};

export { DatePicker };
