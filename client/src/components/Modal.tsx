import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

type ModalProps = {
  open: boolean;
  result: string;
  handleLeaveRoom: () => void;
  socket: Socket;
  roomId: string;
};

export default function Modal({
  open,
  result,
  handleLeaveRoom,
  socket,
  roomId,
}: ModalProps) {
  const [sendingRequest, setSendingRequest] = useState(false);
  const [receivedRequest, setReceivedRequest] = useState(false);
  const sendRematchRequest = () => {
    setSendingRequest(true);
    socket.emit("rematchRequest", roomId);
  };

  const handleRematchResponse = (accept: boolean) => {
    socket.emit("rematchResponse", { roomId, accept });
    if (!accept) {
      handleLeaveRoom();
    }
    setSendingRequest(false);
    setReceivedRequest(false);
  };

  useEffect(() => {
    socket.on("rematchRequest", () => {
      setReceivedRequest(true);
    });
    socket.on("rematchResponse", () => {
      setSendingRequest(false);
      setReceivedRequest(false);
    });
    return () => {
      socket.off("rematchRequest");
      socket.off("rematchResponse");
    };
  }, [socket]);

  return (
    <Dialog open={open} onClose={() => {}} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className=" justify-center">
                <div className="mt-3 text-center ">
                  <DialogTitle
                    as="h1"
                    className="text-3xl my-9 font-bold leading-6 text-gray-900"
                  >
                    {result}
                  </DialogTitle>
                  {!receivedRequest ? (
                    !sendingRequest ? (
                      <button className="bg-cyan-500 justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-400" onClick={sendRematchRequest}>Rematch</button>
                    ) : (
                      <h1 className="font-semibold mb-3">Waiting for opponent's response</h1>
                    )
                  ) : (
                    <div>
                      <h1 className="font-semibold mb-3">Opponent is Requesting a rematch</h1>
                      <div className="flex justify-center space-x-4">
                      <button
                       className="bg-green-500 justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-400"
                       onClick={() => handleRematchResponse(true)}>
                        Accept
                      </button>
                      <button
                       className="bg-blue-500 justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-400"
                       onClick={() => handleRematchResponse(false)}>
                        Reject
                      </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                onClick={handleLeaveRoom}
                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
              >
                Return to Home
              </button>
              {/* <button
                type="button"
                data-autofocus
                onClick={() => setOpen(false)}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Close
              </button> */}
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
