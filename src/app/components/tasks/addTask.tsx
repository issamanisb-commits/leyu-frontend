// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialogLeft";
// import { Button } from "@/components/ui/button";
// import { useState, useEffect } from "react";
// interface basedataDetailsModalProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// export default function AddTask({ onClose }: basedataDetailsModalProps) {
//   const [formData, setFormData] = useState({
//     name: "",
//     code: "",
//     continent: "",
//     description: "",
//   });
//   const addbasedataMutation = useAddBasedata();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await addbasedataMutation.mutateAsync({
//         name: formData.name,
//         code: formData.code,
//         description: formData.description,
//         media: null as File | null,
//       });
//       onClose();
//     } catch (error) {
//       // Error handling is done in useAddbasedata hook
//     }
//   };
//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <label className="block text-gray-700 mb-2"> Name</label>
//           <input
//             type="text"
//             value={formData.name}
//             onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//             className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-gray-700 mb-2">Code</label>
//           <input
//             type="text"
//             value={formData.code}
//             onChange={(e) => setFormData({ ...formData, code: e.target.value })}
//             className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
//             required
//           />
//         </div>
//       </div>

//       {servicename === "country" ? (
//         <div>
//           <label className="block text-gray-700 mb-2">Continent</label>
//           <input
//             type="text"
//             value={formData.continent}
//             onChange={(e) =>
//               setFormData({ ...formData, continent: e.target.value })
//             }
//             className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
//             required
//           />
//         </div>
//       ) : (
//         <></>
//       )}

//       <div className="flex justify-end space-x-2 pt-4">
//         <Button variant="outline" type="button" onClick={onClose}>
//           Cancel
//         </Button>
//         <Button type="submit" disabled={addbasedataMutation.isPending}>
//           {addbasedataMutation.isPending
//             ? "Creating..."
//             : `create ${servicename} basedata`}
//         </Button>
//       </div>
//     </form>
//   );
// }
