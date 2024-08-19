const generateServiceFeeTemplate = function (serviceFee: any, detail: any) {
  let html = `<div style="text-align: center; margin-bottom: 8px;">
        <div style="display: flex; justify-content: center; align-items: center;">
          <img src="/logo.png" alt="Logo Bisnis" style="display: block; width: 100px; height:100px margin-right: auto, margin-left:auto, auto 8px;" />
        </div>
        <h2 style="font-size: 1.25rem; font-weight: bold;">Barong</h2>
        <p style="margin-bottom: 0;">Data : ${detail}</p>
      </div>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f3f4f6;">
            <th style="padding: 8px;">ID Setoran</th>
            <th style="padding: 8px;">Nama Pengepul</th>
            <th style="padding: 8px;">Total Setoran</th>
            <th style="padding: 8px;">Kekurangan</th>
            <th style="padding: 8px;">Tanggal</th>
          </tr>
        </thead>
        <tbody>`

  serviceFee.data.forEach((data: any) => {
    html += `
          <tr>
            <td style="border: 1px solid #e5e7eb; padding: 8px;">${data.id}</td>
            <td style="border: 1px solid #e5e7eb; padding: 8px;">${data.users.name}</td>
            <td style="border: 1px solid #e5e7eb; padding: 8px;">${data.totalFee}</td>
            <td style="border: 1px solid #e5e7eb; padding: 8px;">${data.lackOfFee}</td>
            <td style="border: 1px solid #e5e7eb; padding: 8px;">${data.updated_at.split("T")[0]}</td>
          </tr>`
  })

  html += `
        </tbody>
      </table>
      <div style="text-align: right;">
        <strong style="font-size: 1.25rem;">Total Pendapatan:</strong>
        <span style="margin-left: 8px; font-weight: bold;">Rp.${serviceFee.total}</span>
      </div>`

  return { html }
}

export default generateServiceFeeTemplate

